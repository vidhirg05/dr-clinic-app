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
        background: "#f8fafc",
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
            fontWeight: 600,
            color: "#0f172a",
            margin: 0,
          }}
        >
          Welcome, {doctorName}
        </h1>

        <p
          style={{
            marginTop: 6,
            fontSize: 15,
            color: "#475569",
          }}
        >
          Have a productive day at MyClinic
        </p>
      </div>
    </div>
  );
}
