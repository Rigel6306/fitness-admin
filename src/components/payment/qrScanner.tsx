'use client'

import { useEffect, useRef, useState, useCallback } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import { MdFlashlightOn, MdFlashlightOff, MdCameraswitch } from "react-icons/md";
import { HiOutlineQrCode } from "react-icons/hi2";
import { addNewCashPaymentDoc } from "@/util/payment";
import useUserClientContext from "@/src/hooks/useUserClientContext";

type ScanStatus = "idle" | "scanning" | "success" | "error";

interface QrScannerProps {
    onScanSuccess?: (result: string) => void;
    onScanError?: (error: string) => void;
}

type scannedValueType = {
    userId: string;
    docId: string;
    createdAt: Date | null;
}

const QrScanner = ({ onScanSuccess, onScanError }: QrScannerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const readerRef = useRef<BrowserMultiFormatReader | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const scanDoneRef = useRef(false);

    const users = useUserClientContext();
    const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
    const [selectedCameraIndex, setSelectedCameraIndex] = useState(0);
    const [scanStatus, setScanStatus] = useState<ScanStatus>("idle");
    const [scannedValue, setScannedValue] = useState<scannedValueType | null>({ userId: '', docId: '', createdAt: null });
    const [torchOn, setTorchOn] = useState(false);
    const [torchSupported, setTorchSupported] = useState(false);
    const [isStarting, setIsStarting] = useState(false);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // Initialize reader and camera
    useEffect(() => {
        const reader = new BrowserMultiFormatReader();
        readerRef.current = reader;

        reader.listVideoInputDevices().then((devices) => {
            setCameras(devices);
        }).catch(() => {
            setPermissionDenied(true);
        });

        return () => {
            stopStream();
        };
    }, []);

    const stopStream = useCallback(() => {
        readerRef.current?.reset();
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
    }, []);

    const stopScanner = useCallback(() => {
        scanDoneRef.current = true;
        stopStream();
        setScanStatus("idle");
    }, [stopStream]);

    // Accept parsed data directly to avoid waiting on async state updates
    const createPaymentInstance = useCallback(async (parsedData: scannedValueType) => {
        const foundUser = users.find(u => u.id === parsedData.userId);
        if (!foundUser) {
            setError("Couldn't find a user, please scan Again");
            return;
        }
        if (!parsedData.docId) {
            setError("Couldn't Find Payment Information. please Scan again");
            return;
        }

        setUser(foundUser);

        const paymentData = {
            user_id: foundUser.id,
            payment_id: parsedData.docId,
            amount: '',
            status_message: "pending",
            payment_method: "cash",
            userName: foundUser.data.name,
            email: foundUser.data.email,
            phone: foundUser.data.contactNumber
        };

        try {
            await addNewCashPaymentDoc(paymentData);
        } catch (err) {
            setError("Failed to process payment integration.");
        }
    }, [users]);

    const confirmPayment = async () => {

        const paymentData = {
            payment_id: scannedValue.docId,
            amount: user.data.package.price,
            status_message: "completed",
        };
        try {
            await addNewCashPaymentDoc(paymentData);
            setScannedValue(null)
            setScanStatus('idle')
        } catch (err) {
            setError("Error Occured Updating Payment Info. try again")
        }

    }

    const startScanner = useCallback(async () => {
        if (!readerRef.current || isStarting) return;

        scanDoneRef.current = false;
        setIsStarting(true);
        setScanStatus("scanning");
        setScannedValue(null);
        setError(null);

        try {
            const deviceId = cameras[selectedCameraIndex]?.deviceId;

            const constraints: MediaStreamConstraints = {
                video: deviceId
                    ? { deviceId: { exact: deviceId } }
                    : { facingMode: "environment" },
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

            const track = stream.getVideoTracks()[0];
            const capabilities = track.getCapabilities() as MediaTrackCapabilities & { torch?: boolean };
            setTorchSupported(!!capabilities?.torch);

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }

            readerRef.current!.decodeFromStream(stream, videoRef.current!, (result, err) => {
                if (scanDoneRef.current) return;

                if (result) {
                    scanDoneRef.current = true;
                    const text = result.getText();
                    const parsed = JSON.parse(text) as scannedValueType;
                    setScannedValue(parsed);
                    setScanStatus("success");
                    createPaymentInstance(parsed);
                    onScanSuccess?.(text);
                    stopStream();
                    return;
                }

                if (err && !(err instanceof NotFoundException)) {
                    const msg = err.message ?? "";
                    if (
                        msg.includes("Video stream has ended") ||
                        msg.includes("stream has ended") ||
                        msg.includes("ended")
                    ) return;

                    setScanStatus("error");
                    onScanError?.(msg);
                }
            }).catch(() => { });

        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Camera error";
            if (message.includes("Permission") || message.includes("NotAllowed")) {
                setPermissionDenied(true);
            }
            setScanStatus("error");
        } finally {
            setIsStarting(false);
        }
    }, [cameras, selectedCameraIndex, isStarting, onScanSuccess, onScanError, stopStream, createPaymentInstance]);

    const toggleTorch = useCallback(async () => {
        if (!streamRef.current) return;
        const track = streamRef.current.getVideoTracks()[0];
        try {
            await track.applyConstraints({ advanced: [{ torch: !torchOn } as MediaTrackConstraintSet] });
            setTorchOn((prev) => !prev);
        } catch {
            // Torch toggle failed silently
        }
    }, [torchOn]);

    const switchCamera = useCallback(() => {
        stopScanner();
        setSelectedCameraIndex((prev) => (prev + 1) % cameras.length);
    }, [cameras.length, stopScanner]);

    const handleReset = () => {
        scanDoneRef.current = true;
        stopStream();
        setScannedValue(null);
        setError(null);
        setUser(null);
        setScanStatus("idle");
    };

    const isActive = scanStatus === "scanning";

    return (
        <div className="flex flex-col gap-3 flex-1 min-h-0">
            {/* Scanner Viewport */}
            <div className="relative flex-1 min-h-0 rounded-xl overflow-hidden border border-white/5 bg-black/60">
                {/* Video Element */}
                <video
                    ref={videoRef}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"}`}
                    muted
                    playsInline
                />

                {/* Idle / Permission Denied State */}
                {!isActive && scanStatus !== "success" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70">
                        {permissionDenied ? (
                            <>
                                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                    <HiOutlineQrCode className="text-red-400" size={22} />
                                </div>
                                <p className="text-white/40 text-[10px] font-mono tracking-widest uppercase text-center px-6">
                                    Camera access denied — check browser permissions
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="relative w-36 h-36 flex items-center justify-center">
                                    <CornerBrackets dim />
                                    <HiOutlineQrCode className="text-white/15" size={40} />
                                </div>
                                <p className="text-white/30 text-[10px] font-mono tracking-widest uppercase">
                                    {isStarting ? "initialising camera…" : "camera inactive"}
                                </p>
                            </>
                        )}
                    </div>
                )}

                {/* Active Scanning Overlay */}
                {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="absolute inset-0"
                            style={{
                                background: "radial-gradient(ellipse 55% 55% at 50% 50%, transparent 40%, rgba(0,0,0,0.65) 100%)"
                            }}
                        />

                        <div className="relative w-52 h-52">
                            <CornerBrackets />
                            <style>{`
                                @keyframes qr-scanline {
                                    0%   { top: 0%; }
                                    50%  { top: calc(100% - 1px); }
                                    100% { top: 0%; }
                                }
                            `}</style>
                            <div className="absolute inset-x-2 overflow-hidden" style={{ top: "8px", bottom: "8px" }}>
                                <div
                                    className="absolute left-0 right-0 h-px"
                                    style={{
                                        background: "linear-gradient(90deg, transparent 0%, #0affca 30%, #0affca 70%, transparent 100%)",
                                        boxShadow: "0 0 8px 1px #0affca60",
                                        animation: "qr-scanline 2s ease-in-out infinite",
                                    }}
                                />
                            </div>
                        </div>

                        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                            <span className="text-[9px] font-mono tracking-widest uppercase text-white/40 flex items-center gap-1.5">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ff0a4f] animate-pulse" />
                                scanning for qr code
                            </span>
                        </div>
                    </div>
                )}

                {/* Success State */}
                {scanStatus === "success" && scannedValue?.docId && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 px-6">
                        <div className="w-10 h-10 rounded-full bg-[#0affca]/10 border border-[#0affca]/20 flex items-center justify-center">
                            <span className="text-[#0affca] text-lg">✓</span>
                        </div>
                        <p className="text-[9px] font-mono tracking-widest uppercase text-[#0affca]/60">
                            qr code detected
                        </p>
                        <div className="w-full max-w-xs bg-white/3 border border-white/5 rounded-lg px-3 py-2 flex flex-col gap-1">
                            <p className="text-white/70 text-xs font-mono text-center truncate">
                                {user?.data?.name || "Loading name..."}
                            </p>
                            <p className="text-[#0affca] text-xs font-mono text-center font-bold truncate">
                                {user?.data?.package?.price ? `RS ${user.data.package.price}` : "Loading amount..."}
                            </p>
                        </div>
                    </div>
                )}

                {/* Error Banner */}
                {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 px-6">
                        <div className="w-10 h-10 rounded-full bg-[#ff0a0a]/10 border border-[#ff0a0a]/20 flex items-center justify-center">
                            <span className="text-[#ff0a0a] text-lg">✕</span>
                        </div>
                        <p className="text-[9px] font-mono tracking-widest uppercase text-[#ff0a0a]/80">
                            Error Occurred
                        </p>
                        <p className="text-white/60 text-xs text-center">{error}</p>
                    </div>
                )}

                {/* Camera Controls */}
                {isActive && (
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                        {torchSupported && (
                            <button
                                onClick={toggleTorch}
                                className="w-8 h-8 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white/50 hover:text-white/90 hover:bg-black/70 transition-all duration-150"
                            >
                                {torchOn ? <MdFlashlightOn size={15} /> : <MdFlashlightOff size={15} />}
                            </button>
                        )}
                        {cameras.length > 1 && (
                            <button
                                onClick={switchCamera}
                                className="w-8 h-8 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white/50 hover:text-white/90 hover:bg-black/70 transition-all duration-150"
                            >
                                <MdCameraswitch size={15} />
                            </button>
                        )}
                    </div>
                )}

                {/* Camera label */}
                {isActive && cameras[selectedCameraIndex] && (
                    <div className="absolute bottom-4 left-4">
                        <span className="text-[8px] font-mono tracking-widest uppercase text-white/20">
                            {cameras[selectedCameraIndex].label || `camera ${selectedCameraIndex + 1}`}
                        </span>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 shrink-0">
                {scanStatus === "success" || error ? (
                    <>
                        <button
                            onClick={handleReset}
                            className="flex-1 h-10 rounded-xl bg-white/3 border border-white/5 text-[10px] font-mono tracking-widest uppercase cursor-pointer  text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-150"
                        >
                            scan again
                        </button>
                        <button
                            onClick={confirmPayment}
                            disabled={error ? true : false}
                            className={`flex-1 h-10 rounded-xl bg-[#0affca]/10 border border-[#0affca]/20 text-[10px] font-mono tracking-widest uppercase text-[#0affca]/80 hover:bg-[#0affca]/15 hover:text-[#0affca] transition-all duration-150 cursor-pointer ${error && "bg-gray-500 text-[#040404] hover:bg-gray-500 border-[#000000] hover:text-[#040404] hover:border-[#000000] "}`}
                        >
                            confirm payment
                        </button>
                    </>
                ) : isActive ? (
                    <button
                        onClick={stopScanner}
                        className="flex-1 h-10 rounded-xl bg-white/3 border border-white/5 text-[10px] font-mono tracking-widest uppercase text-white/40 hover:text-white/70 cursor-pointer  hover:bg-white/5 transition-all duration-150"
                    >
                        stop scanner
                    </button>
                ) : (
                    <button
                        onClick={startScanner}
                        disabled={isStarting || permissionDenied}
                        className="flex-1 h-10 rounded-xl bg-[#ffb03a]/10 border border-[#ffb03a]/20 text-[10px] font-mono tracking-widest uppercase text-[#ffb03a]/80 hover:bg-[#ffb03a]/15 hover:text-[#ffb03a] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer "
                    >
                        {isStarting ? "starting…" : "start scanner"}
                    </button>
                )}
            </div>
        </div>
    );
};

const CornerBrackets = ({ dim = false }: { dim?: boolean }) => {
    const color = dim ? "rgba(255,255,255,0.06)" : "#0affca";
    const len = 16;
    const stroke = dim ? 1 : 1.5;

    return (
        <>
            <svg className="absolute top-0 left-0" width={len + 4} height={len + 4} viewBox={`0 0 ${len + 4} ${len + 4}`}>
                <path d={`M${len + 4},2 H2 V${len + 4}`} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
            </svg>
            <svg className="absolute top-0 right-0" width={len + 4} height={len + 4} viewBox={`0 0 ${len + 4} ${len + 4}`}>
                <path d={`M0,2 H${len + 2} V${len + 4}`} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
            </svg>
            <svg className="absolute bottom-0 left-0" width={len + 4} height={len + 4} viewBox={`0 0 ${len + 4} ${len + 4}`}>
                <path d={`M${len + 4},${len + 2} H2 V0`} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
            </svg>
            <svg className="absolute bottom-0 right-0" width={len + 4} height={len + 4} viewBox={`0 0 ${len + 4} ${len + 4}`}>
                <path d={`M0,${len + 2} H${len + 2} V0`} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
            </svg>
        </>
    );
};

export default QrScanner;