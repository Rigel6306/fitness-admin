
const LiquidOverlay = () => {
    return ( 

        <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl select-none pointer-events-none">
  
  {/* Layer 1: Enhanced Backdrop Clarity & Base Radial Light Map */}
  <div 
    className="absolute inset-0 rounded-2xl backdrop-blur-2xl"
    style={{
      /* Pushed core transparency out further to 65% for maximum water-like clarity */
      background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 65%, rgba(255,255,255,0.03) 85%, rgba(0,0,0,0.18) 100%)',
      boxShadow: '0 20px 40px -16px rgba(0,0,0,0.65)'
    }}
  />

  {/* Layer 2: Soft Curved Fluid Rim (Thick Water Meniscus) */}
  <div 
    className="absolute inset-0 rounded-2xl"
    style={{
      /* Multi-angle radial lights blend into the corners to eliminate straight lines */
      backgroundImage: `
        radial-gradient(circle at 15% 15%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 40%),
        radial-gradient(circle at 85% 15%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 40%),
        radial-gradient(circle at 50% 0%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 60%)
      `,
      /* Advanced Fluid Shading Matrix:
         - Inset 1: Deepened the blur radius (4px) of the top edge to make the rim look rounded and thick, not sharp.
         - Inset 2: Softened the inner glare to expand smoothly into the top corners.
         - Inset 3: A rich, curved water-pool shadow gathering smoothly at the bottom base.
         - Inset 4: A highly transparent boundary stroke that cushions the hard card edges.
      */
      boxShadow: `
        inset 0 2px 4px 0px rgba(255,255,255,0.55),
        inset 0 10px 20px -5px rgba(255,255,255,0.25),
        inset 0 -14px 24px -6px rgba(0,0,0,0.65),
        inset 0 0 0 1px rgba(255,255,255,0.08)
      `
    }}
  />

  {/* Layer 3: Main Studio Glare Shield (Primary Curved Light Reflection) */}
  <div 
    className="absolute top-[3px] left-[4px] right-[4px] h-[42%] rounded-t-[18px] pointer-events-none mix-blend-overlay opacity-95"
    style={{
      /* Shifted to an elliptical radial gradient to mimic a real 3D glossy surface bend */
      background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.15) 55%, rgba(255,255,255,0) 100%)',
      borderTop: '1px solid rgba(255,255,255,0.35)'
    }}
  />

  {/* Layer 4: NEW Secondary Low-Angle Environment Reflection */}
  <div 
    className="absolute bottom-[4px] left-[6px] right-[6px] h-[20%] rounded-b-[18px] pointer-events-none mix-blend-screen opacity-40"
    style={{
      /* Bottom crescent-shaped bounce reflection to make the bubble look fully spherical */
      background: 'linear-gradient(to top, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 100%)'
    }}
  />
</div>
     );
}
 
export default LiquidOverlay;