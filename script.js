
(function () {
  "use strict";

  var KEY = "madrasa-marklist-v1";
  var MAX_SUBJECTS = 14;

  var DEFAULT_SUBJECTS = [
    "QURAN",
    "HIFZ",
    "LISAN",
    "THARIKH",
    "THAJWEED",
    "FIQH",
    "DURUS"
  ];

  var sample = [
    ["MUHAMMED ALFAS ET","M",[30,38,26,43,40,44,48]],
    ["MUHAMMED MUSTHAFA V","M",[24,20,23,23,18,28,27]],
    ["MUHAMMED HASHIM MT","M",[10,20,5,13,3,10,14]],
    ["MUHAMMED SHADIN KP","M",[23,13,11,3,3,8,14]],
    ["MUHAMMED ANSIL PT","M",[23,13,21,42,12,44,27]],
    ["MUHAMMED SHAMMAS V","M",[34,47,35,48,25,37,42]],
    ["MUHAMMED MUSTHAFA PK","M",[28,50,30,23,22,25,44]],
    ["MUHAMMED RAJIH ALI KP","M",[37,46,35,23,35,18,38]],
    ["MUHAMMED ASMIL M","M",[36,35,40,41,41,39,48]],
    ["MUHAMMED SHAHABAS PK","M",[29,25,26,33,41,31,41]],
    ["MUHAMMED MUSTHAFA V","M",[29,43,20,25,31,30,41]],
    ["MUHAMMED ANAS V","M",[30,20,31,30,27,28,38]],
    ["ASEEL KP","M",[41,47,42,42,44,44,47]],
    ["RIYA FATHIMA","F",[40,47,40,47,42,36,50]],
    ["AYISHA HABEEBA","F",[42,46,42,50,46,45,50]],
    ["FATHIMA JISHANA","F",[40,47,42,48,47,41,49]],
    ["FATHIMA JAZA","F",[31,33,33,40,37,22,45]],
    ["SHAMLA","F",[46,47,43,42,38,36,35]],
    ["FATHIMA NASMIN","F",[37,48,46,43,33,36,41]],
    ["SHAHANA SIYA","F",[46,49,49,48,43,40,40]],
    ["FATHIMA SHIFANA","F",[41,50,49,50,45,48,47]]
  ];

  function makeInitialClass() {
    return {
      meta: {
        reg: "9623",
        year: "2026",
        cls: "6",
        term: "പാദ വാർഷികം"
      },
      cfg: {
        pass: 18,
        green: 45,
        yellow: 40,
        max: 50
      },
      subjects: DEFAULT_SUBJECTS.slice(),
      st: sample.map(function (r) {
        return {
          n: r[0],
          g: r[1],
          h: "",
          m: r[2].slice()
        };
      })
    };
  }

  var S = makeInitialClass();
  var ALL = {
    lists: [S],
    cur: 0
  };

  /* Load old or new saved data */

  try {
    var raw = localStorage.getItem(KEY);

    if (raw) {
      var parsed = JSON.parse(raw);

      if (parsed && Array.isArray(parsed.lists) && parsed.lists.length) {
        ALL = parsed;
        ALL.cur = Math.max(
          0,
          Math.min(
            Number.isInteger(ALL.cur) ? ALL.cur : 0,
            ALL.lists.length - 1
          )
        );
      } else if (parsed && parsed.st && parsed.cfg && parsed.meta) {
        ALL = {
          lists: [parsed],
          cur: 0
        };
      }
    }
  } catch (e) {
    console.warn("Saved data could not be loaded:", e);
  }

  function migrateClass(cls) {
    if (!cls.meta) cls.meta = {};
    if (!cls.cfg) {
      cls.cfg = {
        pass: 18,
        green: 45,
        yellow: 40,
        max: 50
      };
    }

    if (!Array.isArray(cls.subjects)) {
      cls.subjects = DEFAULT_SUBJECTS.slice();
    }

    if (cls.subjects.length > MAX_SUBJECTS) {
      cls.subjects = cls.subjects.slice(0, MAX_SUBJECTS);
    }

    if (!Array.isArray(cls.st)) cls.st = [];

    cls.st.forEach(function (student) {
      if (!Array.isArray(student.m)) student.m = [];

      while (student.m.length < cls.subjects.length) {
        student.m.push("");
      }

      if (student.m.length > cls.subjects.length) {
        student.m = student.m.slice(0, cls.subjects.length);
      }

      if (student.n === undefined) student.n = "";
      if (student.g === undefined) student.g = "";
      if (student.h === undefined) student.h = "";
    });
  }

  ALL.lists.forEach(migrateClass);
  var S = ALL.lists[ALL.cur];

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(ALL));
    } catch (e) {
      console.warn("Could not save data:", e);
      alert("Data save ചെയ്യാൻ കഴിഞ്ഞില്ല. Browser storage പരിശോധിക്കുക.");
    }
  }

  function $(id) {
    return document.getElementById(id);
  }

  function num(v) {
    if (v === "" || v === null || v === undefined) return null;
    var x = Number(v);
    return Number.isFinite(x) ? x : null;
  }

  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[c];
    });
  }

  function mk(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt !== undefined) e.textContent = txt;
    return e;
  }

  /* Class details */

  var metaMap = {
    reg: "reg",
    year: "year",
    cls: "cls",
    term: "term"
  };

  Object.keys(metaMap).forEach(function (k) {
    var el = $(k);

    el.addEventListener("input", function () {
      S.meta[k] = el.value;
      renderTabs();
      save();
    });
  });

  ["pass", "green", "yellow", "max"].forEach(function (k) {
    var el = $(k);

    el.addEventListener("input", function () {
      var v = num(el.value);

      if (v !== null) {
        S.cfg[k] = v;
        recalc();
        save();
      }
    });
  });

  function loadForm() {
    Object.keys(metaMap).forEach(function (k) {
      $(k).value = S.meta[k] || "";
    });

    ["pass", "green", "yellow", "max"].forEach(function (k) {
      $(k).value = S.cfg[k];
    });
  }

  /* Subject management */

  function addSubject() {
    if (S.subjects.length >= MAX_SUBJECTS) {
      alert("ഒരു ക്ലാസിൽ പരമാവധി 14 Subjects മാത്രമേ ചേർക്കാൻ കഴിയൂ.");
      return;
    }

    var name = prompt("പുതിയ Subject ന്റെ പേര് നൽകുക:");

    if (name === null) return;

    name = name.trim();

    if (!name) {
      alert("Subject name നൽകണം.");
      return;
    }

    S.subjects.push(name);

    S.st.forEach(function (student) {
      student.m.push("");
    });

    buildRows();
    save();
  }

  function renameSubject(index, value) {
    var name = value.trim();

    if (!name) {
      alert("Subject name ഒഴിച്ചിടാൻ കഴിയില്ല.");
      renderTableHead();
      return;
    }

    S.subjects[index] = name;
    save();
  }

  function removeSubject(index) {
    if (S.subjects.length <= 1) {
      alert("കുറഞ്ഞത് ഒരു Subject എങ്കിലും വേണം.");
      return;
    }

    var name = S.subjects[index];

    if (!confirm(
      '"' + name + '" Subject ഉം അതിലെ എല്ലാ വിദ്യാർത്ഥികളുടെ മാർക്കുകളും നീക്കം ചെയ്യട്ടേ?'
    )) {
      return;
    }

    S.subjects.splice(index, 1);

    S.st.forEach(function (student) {
      student.m.splice(index, 1);
    });

    buildRows();
    save();
  }

  /* Dynamic table header */

  function renderTableHead() {
    var head = $("tableHead");
    head.innerHTML = "";

    var tr = mk("tr");

    [
      "NO",
      "STUDENT NAME",
      "M/F",
      "HAJAR"
    ].forEach(function (name) {
      tr.appendChild(mk("th", "", name));
    });

    S.subjects.forEach(function (subject, index) {
      var th = mk("th");
      var input = mk("input", "subject-name");

      input.value = subject;
      input.title = "Subject name മാറ്റാൻ ഇവിടെ തിരുത്തുക";

      input.addEventListener("change", function () {
        renameSubject(index, input.value);
      });

      input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          input.blur();
        }
      });

      th.appendChild(input);

      var del = mk("button", "subject-delete", "×");
      del.type = "button";
      del.title = "Remove this subject";

      del.addEventListener("click", function () {
        removeSubject(index);
      });

      th.appendChild(del);
      tr.appendChild(th);
    });

    [
      "TOTAL",
      "REMARKS",
      "RANK",
      "ACTION"
    ].forEach(function (name) {
      tr.appendChild(mk("th", "", name));
    });

    head.appendChild(tr);

    var count = $("subjectCount");
    if (count) {
      count.textContent =
        S.subjects.length + " / " + MAX_SUBJECTS + " Subjects";
    }
  }

  /* Student rows */

  var tb = $("rows");

  function buildRows() {
    renderTableHead();
    tb.innerHTML = "";

    S.st.forEach(function (student, i) {
      var tr = mk("tr");

      student.els = {};

      tr.appendChild(mk("td", "", String(i + 1)));

      /* Student name */

      var nameCell = mk("td", "nm");
      var nameInput = mk("input");

      nameInput.value = student.n;
      nameInput.placeholder = "Student name";

      nameInput.addEventListener("input", function () {
        student.n = nameInput.value;
        save();
      });

      nameCell.appendChild(nameInput);
      tr.appendChild(nameCell);

      /* Gender */

      var genderCell = mk("td", "gn");
      var genderInput = mk("input");

      genderInput.value = student.g;
      genderInput.maxLength = 1;
      genderInput.style.textAlign = "center";
      genderInput.title = "M or F";

      genderInput.addEventListener("input", function () {
        genderInput.value = genderInput.value.toUpperCase();
        student.g = genderInput.value;
        recalc();
        save();
      });

      genderCell.appendChild(genderInput);
      tr.appendChild(genderCell);

      /* Hajar */

      var hajarCell = mk("td", "hj");
      var hajarInput = mk("input");

      hajarInput.value = student.h;
      hajarInput.style.textAlign = "center";

      hajarInput.addEventListener("input", function () {
        student.h = hajarInput.value;
        save();
      });

      hajarCell.appendChild(hajarInput);
      tr.appendChild(hajarCell);

      /* Dynamic subject marks */

      student.els.m = [];

      S.subjects.forEach(function (subject, j) {
        var td = mk("td", "subject-mark");
        var inp = mk("input", "m");

        inp.type = "number";
        inp.inputMode = "decimal";
        inp.min = 0;
        inp.max = S.cfg.max;
        inp.value =
          student.m[j] === "" || student.m[j] == null
            ? ""
            : student.m[j];

        inp.title = subject;

        inp.addEventListener("input", function () {
          student.m[j] = inp.value;
          recalc();
          save();
        });

        td.appendChild(inp);
        tr.appendChild(td);
        student.els.m.push(inp);
      });

      /* Total, result, rank */

      student.els.t = mk("td", "tot");
      student.els.r = mk("td");
      student.els.k = mk("td", "rk");

      tr.appendChild(student.els.t);
      tr.appendChild(student.els.r);
      tr.appendChild(student.els.k);

      /* Actions */

      var actionCell = mk("td");

      var removeButton = mk("button", "x", "×");
      removeButton.type = "button";
      removeButton.title = "Remove student";

      removeButton.addEventListener("click", function () {
        if (!confirm("ഈ വിദ്യാർത്ഥിയെ നീക്കം ചെയ്യട്ടേ?")) return;

        S.st.splice(i, 1);
        buildRows();
        save();
      });

      actionCell.appendChild(removeButton);

      var printButton = mk("button", "b row-print", "Print");
      printButton.type = "button";
      printButton.title = "Print this student's mark sheet";

      printButton.addEventListener("click", function () {
        printStudent(i);
      });

      actionCell.appendChild(printButton);
      tr.appendChild(actionCell);

      tb.appendChild(tr);
    });

    recalc();
  }

  /* Result, total and rank calculation */

  function recalc() {
    var cfg = S.cfg;
    var totals = [];

    S.st.forEach(function (student) {
      var vals = student.m.map(num);
      var have = vals.filter(function (v) {
        return v !== null;
      });

      student.total = have.length
        ? have.reduce(function (a, b) {
            return a + b;
          }, 0)
        : null;

      if (!S.subjects.length || !have.length) {
        student.rem = "";
      } else if (have.length < S.subjects.length) {
        student.rem = "INCOMPLETE";
      } else if (Math.min.apply(null, have) < cfg.pass) {
        student.rem = "FAIL";
      } else {
        student.rem = "PASS";
      }

      if (student.total !== null) {
        totals.push(student.total);
      }

      vals.forEach(function (v, j) {
        var input = student.els.m[j];
        if (!input) return;

        var cls = "m";

        if (v !== null) {
          if (v < cfg.pass) {
            cls += " r";
          } else if (v >= cfg.green) {
            cls += " g";
          } else if (v >= cfg.yellow) {
            cls += " y";
          }
        }

        input.className = cls;
        input.max = cfg.max;
      });
    });

    S.st.forEach(function (student) {
      if (!student.els) return;

      student.els.t.textContent =
        student.total === null ? "" : student.total;

      student.els.r.innerHTML = "";

      if (student.rem) {
        student.els.r.appendChild(
          mk("span", "tag " + student.rem, student.rem)
        );
      }

      student.els.k.textContent =
        student.total === null
          ? ""
          : 1 + totals.filter(function (t) {
              return t > student.total;
            }).length;
    });

    stats();
  }

  /* Summary */

  function stats() {
    function count(gender) {
      var arr = S.st.filter(function (student) {
        return student.rem && (!gender || student.g === gender);
      });

      return {
        n: arr.length,
        p: arr.filter(function (s) {
          return s.rem === "PASS";
        }).length,
        f: arr.filter(function (s) {
          return s.rem === "FAIL";
        }).length
      };
    }

    var boys = count("M");
    var girls = count("F");
    var total = count(null);

    function percentage(x) {
      return x.n
        ? (x.p / x.n * 100).toFixed(2) + "%"
        : "–";
    }

    var items = [
      [
        "Students",
        total.n,
        "Boys " + boys.n + " · Girls " + girls.n,
        ""
      ],
      [
        "Passed",
        total.p,
        "Boys " + boys.p + " · Girls " + girls.p,
        ""
      ],
      [
        "Failed",
        total.f,
        "Need attention",
        total.f ? "bad" : ""
      ],
      [
        "Pass %",
        percentage(total),
        "Boys " + percentage(boys) + " · Girls " + percentage(girls),
        ""
      ]
    ];

    var holder = $("stats");
    holder.innerHTML = "";

    items.forEach(function (item) {
      var div = mk("div", "stat " + item[3]);

      div.appendChild(mk("b", "", String(item[1])));
      div.appendChild(mk("strong", "", item[0]));
      div.appendChild(mk("br"));
      div.appendChild(mk("span", "", item[2]));

      holder.appendChild(div);
    });
  }

  /* Individual student print */

  function printStudent(index) {
    var student = S.st[index];
    if (!student) return;

    var total = student.total === null ? "—" : student.total;
    var result = student.rem || "NOT ENTERED";

    var rows = S.subjects.map(function (subject, j) {
      var mark =
        student.m[j] === "" || student.m[j] == null
          ? "—"
          : student.m[j];

      return (
        "<tr>" +
          "<td>" + esc(subject) + "</td>" +
          "<td>" + esc(mark) + "</td>" +
          "<td>" + esc(S.cfg.max) + "</td>" +
        "</tr>"
      );
    }).join("");

    var rank = student.total === null
      ? "—"
      : 1 + S.st.filter(function (other) {
          return other.total !== null &&
            other.total > student.total;
        }).length;

    var html =
      '<div class="student-print-card">' +
        '<h1>NOORUL ISLAM MADRASA EETHAPPADI,CHERUKODE</h1>' +
        '<div class="school-sub">Under: Samastha Kerala Islam Matha Vidyabhyasa Board (SKIMVB) </div>' + '<div class="school-sub"> <h2> MARK SHEET </h2></div>' +
        '<h2>' + esc(S.meta.term) + ' · ' + esc(S.meta.year) + '</h2>' +

        '<div class="student-meta">' +
          '<div><b>Class:</b> ' + esc(S.meta.cls) + '</div>' +
          '<div><b>Reg. No:</b> ' + esc(S.meta.reg) + '</div>' +
          '<div><b>Student:</b> ' + esc(student.n) + '</div>' +
          '<div><b>Gender:</b> ' + esc(student.g) + '</div>' +
          '<div><b>Hajar:</b> ' + esc(student.h) + '</div>' +
        '</div>' +

        '<table>' +
          '<thead><tr><th>Subject</th><th>Mark</th><th>Maximum</th></tr></thead>' +
          '<tbody>' +
            rows +
            '<tr>' +
              '<th>Total</th>' +
              '<th>' + esc(total) + '</th>' +
              '<th>' + esc(S.cfg.max * S.subjects.length) + '</th>' +
            '</tr>' +
          '</tbody>' +
        '</table>' +

        '<div class="print-result">' +
          'Result: ' + esc(result) +
          ' &nbsp; | &nbsp; Rank: ' + esc(rank) +
        '</div>' +

        '<div class="signature-row">' +
          '<span>Teacher</span>' +
          '<span>Parent / Guardian</span>' +
        '</div>' +
      '</div>';

    var holder = document.createElement("div");
    holder.className = "individual-print";
    holder.innerHTML = html;

    document.body.appendChild(holder);
    document.body.classList.add("individual-print-mode");

    function cleanup() {
      document.body.classList.remove("individual-print-mode");
      holder.remove();
      window.removeEventListener("afterprint", cleanup);
    }

    window.addEventListener("afterprint", cleanup);
    window.print();

    setTimeout(cleanup, 1500);
  }

  /* Print class */

  $("print").addEventListener("click", function () {
    document.body.classList.add("class-print-mode");

    function cleanup() {
      document.body.classList.remove("class-print-mode");
      window.removeEventListener("afterprint", cleanup);
    }

    window.addEventListener("afterprint", cleanup);
    window.print();

    setTimeout(cleanup, 1500);
  });

  /* Add student */

  $("add").addEventListener("click", function () {
    var marks = S.subjects.map(function () {
      return "";
    });

    S.st.push({
      n: "",
      g: "",
      h: "",
      m: marks
    });

    buildRows();
    save();

    var inputs = tb.querySelectorAll("tr:last-child td.nm input");

    if (inputs[0]) inputs[0].focus();
  });

  /* Clear marks */

  var armed = false;
  var clearButton = $("clear");

  clearButton.addEventListener("click", function () {
    if (!armed) {
      armed = true;
      clearButton.textContent = "Tap again to confirm";

      setTimeout(function () {
        armed = false;
        clearButton.textContent = "Clear all marks";
      }, 3000);

      return;
    }

    armed = false;
    clearButton.textContent = "Clear all marks";

    S.st.forEach(function (student) {
      student.m = S.subjects.map(function () {
        return "";
      });
    });

    buildRows();
    save();
  });

  /* Class tabs */

  function renderTabs() {
    var tabs = $("tabs");
    tabs.innerHTML = "";

    ALL.lists.forEach(function (cls, i) {
      var button = mk(
        "button",
        "tab" + (i === ALL.cur ? " on" : ""),
        "Class " +
          (cls.meta.cls || "?") +
          (cls.meta.term ? " · " + cls.meta.term : "") +
          (cls.meta.year ? " · " + cls.meta.year : "")
      );

      button.type = "button";

      button.addEventListener("click", function () {
        go(i);
      });

      tabs.appendChild(button);
    });
  }

  function go(index) {
    ALL.cur = index;
    S = ALL.lists[index];

    migrateClass(S);
    loadForm();
    renderTabs();
    buildRows();
    save();
  }

  /* Create new class */

  function blankMarks() {
    return S.subjects.map(function () {
      return "";
    });
  }

  function fresh(students, subjects) {
    var meta = S.meta;
    var cfg = S.cfg;

    var newClass = {
      meta: {
        reg: meta.reg,
        year: meta.year,
        cls: "",
        term: meta.term
      },
      cfg: {
        pass: cfg.pass,
        green: cfg.green,
        yellow: cfg.yellow,
        max: cfg.max
      },
      subjects: subjects.slice(),
      st: students
    };

    migrateClass(newClass);

    ALL.lists.push(newClass);
    go(ALL.lists.length - 1);

    $("cls").focus();
  }

  $("newc").addEventListener("click", function () {
    fresh([], []);
  });

  $("copyc").addEventListener("click", function () {
    var copiedStudents = S.st.map(function (student) {
      return {
        n: student.n,
        g: student.g,
        h: "",
        m: blankMarks()
      };
    });

    fresh(copiedStudents, S.subjects);
  });

  /* Delete class */

  var deleteArmed = false;
  var deleteButton = $("delc");

  deleteButton.addEventListener("click", function () {
    if (ALL.lists.length < 2) {
      deleteButton.textContent = "Keep at least one class";

      setTimeout(function () {
        deleteButton.textContent = "Delete this class";
      }, 2500);

      return;
    }

    if (!deleteArmed) {
      deleteArmed = true;
      deleteButton.textContent = "Tap again to delete";

      setTimeout(function () {
        deleteArmed = false;
        deleteButton.textContent = "Delete this class";
      }, 3000);

      return;
    }

    deleteArmed = false;
    deleteButton.textContent = "Delete this class";

    if (!confirm("ഈ ക്ലാസും അതിലെ ഡാറ്റയും മുഴുവനായി നീക്കം ചെയ്യട്ടേ?")) {
      return;
    }

    ALL.lists.splice(ALL.cur, 1);
    go(Math.min(ALL.cur, ALL.lists.length - 1));
  });

  /* Add subject button */

  $("addSubject").addEventListener("click", addSubject);

  /* Start app */

  loadForm();
  renderTabs();
  buildRows();
  save();

})();
