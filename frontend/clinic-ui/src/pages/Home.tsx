export default function Home() {
  const doctor = JSON.parse(localStorage.getItem("doctor") || "null");
  const doctorName = doctor
    ? `Dr. ${[doctor.firstName, doctor.middleName, doctor.lastName]
        .filter(Boolean)
        .join(" ")}`
    : "Doctor";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // Soft Slate background for a professional feel
        background: "#F8FAFC", 
      }}
    >
      {/* IMAGE AREA */}
      <div
        style={{
          width: "100%",
          height: "70%",
          backgroundImage: "url('/bg-clinic.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "contain",
          // Subtle opacity helps the image blend into the background
          opacity: 0.9, 
        }}
      />

      {/* TEXT BELOW IMAGE */}
      <div
        style={{
          marginTop: 20,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            // Deep Navy (Primary brand color)
            color: "#0F172A", 
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Welcome, {doctorName}
        </h1>

        <p
          style={{
            marginTop: 8,
            fontSize: 15,
            // Muted Slate (Secondary text color)
            color: "#64748B", 
            fontWeight: 500,
          }}
        >
          Have a productive day at MyClinic
        </p>
      </div>
    </div>
  );
}