function appointmentTemplate({
  patientName,
  doctorName,
  specialization,
  appointmentDate,
  appointmentTime,
  appointmentId,
}) {
  return `
<!DOCTYPE html>
<html>

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width, initial-scale=1.0"
/>

<style>

body{
margin:0;
padding:0;
background:#edf4fb;
font-family:Arial,Helvetica,sans-serif;
}

.wrapper{
width:100%;
padding:40px 0;
background:#edf4fb;
}

.container{

max-width:700px;
margin:auto;
background:white;
border-radius:18px;
overflow:hidden;
box-shadow:0 15px 40px rgba(0,0,0,.12);

}

.header{

background:linear-gradient(135deg,#2563eb,#1d4ed8);

padding:45px;

text-align:center;

color:white;

}

.logo{

width:90px;

height:90px;

border-radius:50%;

background:white;

margin:auto;

display:flex;

align-items:center;

justify-content:center;

font-size:44px;

}

.hospital{

font-size:34px;

font-weight:bold;

margin-top:18px;

letter-spacing:1px;

}

.tagline{

font-size:18px;

opacity:.9;

margin-top:10px;

}

.content{

padding:45px;

color:#374151;

}

.greeting{

font-size:22px;

font-weight:bold;

margin-bottom:15px;

color:#111827;

}

.message{

font-size:18px;

line-height:1.8;

margin-bottom:35px;

}

.card{

background:#f8fbff;

border-left:6px solid #2563eb;

border-radius:14px;

padding:30px;

}

.card-title{

font-size:24px;

font-weight:bold;

color:#2563eb;

margin-bottom:25px;

}

.info-row{

display:flex;

justify-content:space-between;

padding:16px 0;

border-bottom:1px solid #dbeafe;

font-size:18px;

}

.label{

font-weight:bold;

color:#475569;

}

.value{

font-weight:600;

color:#111827;

}

.status{

margin-top:30px;

text-align:center;

}

.badge{

display:inline-block;

padding:14px 34px;

background:#16a34a;

color:white;

border-radius:999px;

font-size:18px;

font-weight:bold;

letter-spacing:1px;

}

.footer{

margin-top:40px;

background:#f8fafc;

padding:35px;

text-align:center;

font-size:16px;

color:#64748b;

line-height:1.8;

}

</style>

</head>

<body>

<div class="wrapper">

<div class="container">

<div class="header">

<div class="logo">

🏥

</div>

<div class="hospital">

FATIMA HOSPITAL

</div>

<div class="tagline">

Hospital & Research Center

</div>

</div>

<div class="content">

<div class="greeting">

Hello ${patientName} 👋

</div>

<div class="message">

Your appointment has been successfully confirmed.

<br><br>

Thank you for choosing
<b>Fatima Hospital & Research Center.</b>

</div>

<hr
style="
border:none;
height:1px;
background:#e2e8f0;
margin:35px 0;
"
/>

<div class="card">

<div class="card-title">

Appointment Details

</div>

<div class="info-row">

<span class="label">

👨‍⚕ Doctor

</span>

<span class="value">

${doctorName}

</span>

</div>

<div class="info-row">

<span class="label">

🩺 Specialization

</span>

<span class="value">

${specialization}

</span>

</div>

<div class="info-row">

<span class="label">

📅 Date

</span>

<span class="value">

${new Date(appointmentDate).toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "long",
  year: "numeric",
})}

</span>

</div>

<div class="info-row">

<span class="label">

🕒 Time

</span>

<span class="value">

${new Date(
  "1970-01-01T" + appointmentTime
).toLocaleTimeString("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
})}

</span>

</div>
<div class="info-row">

<span class="label">

🆔 Appointment ID

</span>

<span class="value">

FH-${appointmentId}

</span>

</div>

<div class="status">

<span class="badge">

✔ APPOINTMENT CONFIRMED

</span>

</div>

</div>

<div class="footer">

<b>Fatima Hospital & Research Center</b>

<br><br>

Please arrive at least
<b>15 minutes</b>
before your appointment.

<br><br>

Thank you for trusting us with your healthcare.

</div>

</div>

</div>

</div>

</body>

</html>
`;
}

module.exports = appointmentTemplate;