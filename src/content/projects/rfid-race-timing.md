---
title: "RFID Race Timing System"
summary: "A race-timing system built for the 5th Carrera del Informático (August 2026) that combines automated RFID timing with a manual tablet client, synchronized in real time with an admin panel for live results, podiums and corrections."
order: 4
status: "completed"
tags: ["Python", "RFID", "WebSocket", "MongoDB", "Web"]
role: "Co-developer, with two classmates: initial backend (API, worker, database, live WebSocket) and the RFID reader app"
repo: "https://github.com/maovares/carrera-informatico-rfid.git"
paper: "https://www.compdes.org/libros/compdes2025.pdf"
paperLabel: "Paper (COMPDES 2025)"
preview: "/projects/rfid-race-timing/demo.gif"
previewWidth: 800
previewHeight: 451
---

Used in a real race organized by the School of Computing at TEC San Carlos, with a 5k recreational category and a competitive 10k split into subcategories for men and women. Some 10k runners wore RFID tags on their bibs, and crossing the finish line recorded their time from a global start time set per category. Every timing source reported to a central server connected over WebSockets to an admin panel, where organizers could view times and podiums, edit or delete records, and assign tags to runners. A tablet-based client let a person enter arriving runners manually, and each entry appeared in the admin panel immediately.

Built with two classmates. Marcos Rodríguez Ovares built the admin panel, podium, results portal and reports, along with the later backend work (roster import, time corrections, public and report endpoints) and the deployment. Sebastián Sandí Blanco built the client app with offline saving, the visual design and the Docker setup. My part was the initial backend (API, worker, database and live WebSocket) and the RFID reader app that reads the tags at the finish line.
