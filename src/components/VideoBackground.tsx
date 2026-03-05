const VideoBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover"
      >
        <source src="/bg.mp4" type="video/mp4" />
      </video>
      {/* Dark overlay */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, hsl(0 0% 0% / 0.4) 0%, hsl(0 0% 0% / 0.6) 50%, hsl(0 0% 0% / 0.8) 100%)"
      }} />
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at center, transparent 30%, hsl(0 0% 0% / 0.5) 100%)"
      }} />
    </div>
  );
};

export default VideoBackground;
