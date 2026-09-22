document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // СОСТОЯНИЕ ИГРЫ
  // =========================

  const state = {
    turn: 1,
    maxTurns: 20,

    money: 1200,

    metrics: {
      happiness: 60,
      ecology: 55,
      mobility: 50,
      education: 45,
      health: 50,
      economy: 55
    },

    population: 120000,

    projects: {},

    news: [
      "Город просыпается. Жители ждут ваших решений.",
      "Акимат получил новый бюджет.",
      "Начинается первый рабочий месяц."
    ],

    started: false,
    eventOpen: false,
    gameOver: false
  };


  // =========================
  // КЛЮЧ СОХРАНЕНИЯ
  // =========================

  const SAVE_KEY = "merocity-save-v3";


  // =========================
  // ПРОЕКТЫ
  // =========================

  const PROJECTS = {

    park: {
      name: "Городской парк",
      icon: "🌳",
      costs: [70, 45, 60],
      income: 2,

      effects: {
        ecology: 7,
        happiness: 6
      },

      position: [115, 330]
    },

    school: {
      name: "Школа",
      icon: "🏫",
      costs: [100, 65, 90],
      income: 1,

      effects: {
        education: 9,
        happiness: 3
      },

      position: [230, 150]
    },

    hospital: {
      name: "Больница",
      icon: "🏥",
      costs: [130, 80, 110],
      income: 1,

      effects: {
        health: 10,
        happiness: 5
      },

      position: [580, 150]
    },

    metro: {
      name: "Метро",
      icon: "🚇",
      costs: [250, 150, 200],
      income: 5,

      effects: {
        mobility: 15,
        economy: 5,
        happiness: 4
      },

      position: [330, 410]
    },

    recycling: {
      name: "Центр переработки",
      icon: "♻️",
      costs: [90, 60, 80],
      income: 3,

      effects: {
        ecology: 12,
        economy: 2
      },

      position: [620, 420]
    },

    solar: {
      name: "Солнечная электростанция",
      icon: "☀️",
      costs: [180, 110, 150],
      income: 9,

      effects: {
        ecology: 10,
        economy: 7
      },

      position: [700, 300]
    },

    market: {
      name: "Городской рынок",
      icon: "🏪",
      costs: [80, 55, 75],
      income: 12,

      effects: {
        economy: 8,
        happiness: 3
      },

      position: [220, 400]
    },

    housing: {
      name: "Жилой комплекс",
      icon: "🏢",
      costs: [160, 100, 140],
      income: 16,

      effects: {
        economy: 6,
        happiness: 4,
        mobility: -3
      },

      position: [530, 100]
    },

    bike: {
      name: "Велодорожки",
      icon: "🚲",
      costs: [60, 40, 55],
      income: 1,

      effects: {
        mobility: 8,
        ecology: 6,
        health: 3
      },

      position: [410, 500]
    },

    water: {
      name: "Очистка воды",
      icon: "💧",
      costs: [120, 75, 100],
      income: 2,

      effects: {
        ecology: 9,
        health: 8
      },

      position: [690, 500]
    },

    university: {
      name: "Университет",
      icon: "🎓",
      costs: [280, 180, 230],
      income: 10,

      effects: {
        education: 15,
        economy: 10
      },

      position: [90, 180]
    },

    stadium: {
      name: "Стадион",
      icon: "🏟️",
      costs: [200, 120, 160],
      income: 10,

      effects: {
        happiness: 9,
        health: 5,
        economy: 5
      },

      position: [500, 520]
    },

    tourism: {
      name: "Туристический центр",
      icon: "🏨",
      costs: [220, 140, 190],
      income: 20,

      effects: {
        economy: 14,
        happiness: 5,
        ecology: -3
      },

      position: [720, 100]
    }

  };


  // =========================
  // СОБЫТИЯ
  // =========================

  const EVENTS = [

    {
      tag: "ЭКОЛОГИЯ",
      icon: "🌫️",
      title: "Экологический кризис",
      description:
        "В городе резко ухудшилось качество воздуха.",

      choices: [
        {
          text: "Выделить 50 млн ₸",
          cost: 50,

          effects: {
            ecology: 12,
            happiness: 4
          },

          news: "🌱 Акимат выделил средства на борьбу с загрязнением."
        },

        {
          text: "Ничего не делать",

          effects: {
            ecology: -12,
            happiness: -6
          },

          news: "🌫️ Загрязнение воздуха продолжает расти."
        }
      ]
    },

    {
      tag: "ТРАНСПОРТ",
      icon: "🚗",
      title: "Транспортный коллапс",
      description:
        "Главные дороги города оказались перегружены.",

      choices: [
        {
          text: "Выделить 70 млн ₸",
          cost: 70,

          effects: {
            mobility: 12,
            economy: 3
          },

          news: "🚦 Город выделил средства на решение транспортной проблемы."
        },

        {
          text: "Организовать временные меры",

          effects: {
            mobility: 7,
            happiness: 3
          },

          news: "🚗 Введены временные меры против пробок."
        },

        {
          text: "Ничего не делать",

          effects: {
            mobility: -10,
            happiness: -7
          },

          news: "🚨 Пробки серьёзно осложнили жизнь горожан."
        }
      ]
    },

    {
      tag: "ЗДРАВООХРАНЕНИЕ",
      icon: "🏥",
      title: "Нагрузка на больницы",
      description:
        "Городские больницы столкнулись с резким увеличением нагрузки.",

      choices: [
        {
          text: "Выделить 60 млн ₸",
          cost: 60,

          effects: {
            health: 12,
            happiness: 5
          },

          news: "🏥 Больницы получили дополнительное финансирование."
        },

        {
          text: "Оставить всё как есть",

          effects: {
            health: -12,
            happiness: -8
          },

          news: "🏥 Медицинская система испытывает серьёзные трудности."
        }
      ]
    },

    {
      tag: "ТУРИЗМ",
      icon: "🧳",
      title: "Поток туристов",
      description:
        "В город неожиданно приехало много туристов.",

      choices: [
        {
          text: "Инвестировать 40 млн ₸",
          cost: 40,

          effects: {
            economy: 10,
            happiness: 4
          },

          news: "🧳 Туристическая инфраструктура получила инвестиции."
        },

        {
          text: "Принять туристов без вложений",

          money: 70,

          effects: {
            economy: 3,
            happiness: -5
          },

          news: "🧳 Туристы принесли дополнительный доход."
        }
      ]
    },

    {
      tag: "ЭКОНОМИКА",
      icon: "💼",
      title: "Предложение инвестора",
      description:
        "Крупный инвестор предлагает вложиться в город.",

      choices: [
        {
          text: "Принять предложение",

          money: 100,

          effects: {
            economy: 12
          },

          news: "💼 В город пришли новые инвестиции."
        },

        {
          text: "Отказаться",

          effects: {
            economy: -2
          },

          news: "💼 Инвестор отказался от сотрудничества."
        }
      ]
    },

    {
      tag: "ГОРОД",
      icon: "🎉",
      title: "Городской фестиваль",
      description:
        "Жители предлагают провести большой городской фестиваль.",

      choices: [
        {
          text: "Провести фестиваль",

          cost: 35,

          effects: {
            happiness: 12,
            economy: 5
          },

          news: "🎉 Городской фестиваль прошёл успешно."
        },

        {
          text: "Провести небольшой праздник",

          cost: 10,

          effects: {
            happiness: 5,
            economy: 2
          },

          news: "🎉 Небольшой праздник поднял настроение горожанам."
        }
      ]
    },

    {
      tag: "ОБРАЗОВАНИЕ",
      icon: "📚",
      title: "Проблемы школ",
      description:
        "Несколько школ города попросили дополнительное финансирование.",

      choices: [
        {
          text: "Выделить 50 млн ₸",
          cost: 50,

          effects: {
            education: 10
          },

          news: "📚 Школы получили дополнительное финансирование."
        },

        {
          text: "Перераспределить средства",

          effects: {
            education: -5,
            economy: 3
          },

          news: "📚 Часть средств была направлена на другие нужды города."
        }
      ]
    },

    {
      tag: "ПОГОДА",
      icon: "🌧️",
      title: "Сильный ливень",
      description:
        "Сильные дожди затопили несколько улиц.",

      choices: [
        {
          text: "Срочно устранить последствия",

          cost: 60,

          effects: {
            ecology: 5,
            happiness: 6,
            mobility: 7
          },

          news: "🌧️ Последствия ливня удалось быстро устранить."
        },

        {
          text: "Частично устранить последствия",

          cost: 25,

          effects: {
            happiness: 3,
            mobility: 3
          },

          news: "🌧️ Город частично справился с последствиями ливня."
        }
      ]
    },

    {
      tag: "ЭНЕРГЕТИКА",
      icon: "⚡",
      title: "Проблемы с электричеством",
      description:
        "В городе возникли перебои с электроэнергией.",

      choices: [
        {
          text: "Выделить 80 млн ₸",
          cost: 80,

          effects: {
            economy: 7,
            happiness: 5
          },

          news: "⚡ Энергетическая проблема была быстро решена."
        },

        {
          text: "Ввести ограничения",

          effects: {
            economy: -3,
            happiness: -8
          },

          news: "⚡ В городе введены временные ограничения."
        }
      ]
    },

    {
      tag: "БЮДЖЕТ",
      icon: "🏛️",
      title: "Государственный грант",
      description:
        "Город может подать заявку на получение дополнительного финансирования.",

      choices: [
        {
          text: "Подать заявку",

          money: 120,

          effects: {
            economy: 5
          },

          news: "🏛️ Город получил государственный грант."
        },

        {
          text: "Не подавать заявку",

          news: "🏛️ Город отказался от участия в программе."
        }
      ]
    }

  ];
    // =========================
  // DOM-ЭЛЕМЕНТЫ
  // =========================

  const startScreen = document.getElementById("startScreen");
  const startBtn = document.getElementById("startBtn");

  const projectsContainer =
    document.getElementById("projects");

  const turnEl =
    document.getElementById("turn");

  const moneyEl =
    document.getElementById("money");

  const incomePerTurnEl =
    document.getElementById("incomePerTurn");


  const metricEls = {
    happiness: {
      value: document.getElementById("happinessValue"),
      bar: document.getElementById("happinessBar")
    },

    ecology: {
      value: document.getElementById("ecologyValue"),
      bar: document.getElementById("ecologyBar")
    },

    mobility: {
      value: document.getElementById("mobilityValue"),
      bar: document.getElementById("mobilityBar")
    },

    education: {
      value: document.getElementById("educationValue"),
      bar: document.getElementById("educationBar")
    },

    health: {
      value: document.getElementById("healthValue"),
      bar: document.getElementById("healthBar")
    },

    economy: {
      value: document.getElementById("economyValue"),
      bar: document.getElementById("economyBar")
    }
  };


  const newsTurn =
    document.getElementById("newsTurn");

  const newsList =
    document.getElementById("newsList");


  const projectObjects =
    document.getElementById("projectObjects");


  const eventModal =
    document.getElementById("eventModal");

  const eventTag =
    document.getElementById("eventTag");

  const eventIcon =
    document.getElementById("eventIcon");

  const eventTitle =
    document.getElementById("eventTitle");

  const eventDescription =
    document.getElementById("eventDescription");

  const eventChoices =
    document.getElementById("eventChoices");


  const finishModal =
    document.getElementById("finishModal");

  const finalScore =
    document.getElementById("finalScore");

  const finalHappiness =
    document.getElementById("finalHappiness");

  const finalEcology =
    document.getElementById("finalEcology");

  const finalEconomy =
    document.getElementById("finalEconomy");


  const toastEl =
    document.getElementById("toast");


  // =========================
  // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
  // =========================

  function clamp(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, value));
  }


  function formatMoney(value) {
    return `${Math.round(value)} млн ₸`;
  }


  function changeMetric(metric, amount) {
    if (!Object.prototype.hasOwnProperty.call(
      state.metrics,
      metric
    )) {
      return;
    }

    state.metrics[metric] = clamp(
      state.metrics[metric] + amount
    );
  }


  function addNews(message) {
    if (!message) return;

    state.news.unshift(message);

    if (state.news.length > 8) {
      state.news.pop();
    }
  }


  function showToast(message) {
    if (!toastEl) return;

    toastEl.textContent = message;

    toastEl.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
      toastEl.classList.remove("show");
    }, 2200);
  }


  // =========================
  // ФИНАНСЫ
  // =========================

  function getIncome() {
    let income = 25;

    Object.entries(state.projects).forEach(
      ([id, level]) => {

        const project = PROJECTS[id];

        if (!project) return;

        income += project.income * level;
      }
    );

    income += Math.floor(
      state.metrics.economy / 20
    );

    return Math.max(0, income);
  }


  function getExpenses() {
    let expenses = 12;

    Object.values(state.projects).forEach(
      level => {
        expenses += level * 2;
      }
    );

    return expenses;
  }


  function getBalance() {
    return getIncome() - getExpenses();
  }


  // =========================
  // ПРОЕКТЫ
  // =========================

  function getProjectLevel(id) {
    return state.projects[id] || 0;
  }


  function getProjectCost(id) {
    const project = PROJECTS[id];

    if (!project) {
      return null;
    }

    const level = getProjectLevel(id);

    if (level >= project.costs.length) {
      return null;
    }

    return project.costs[level];
  }


  function createProjectCards() {
    if (!projectsContainer) return;

    projectsContainer.innerHTML = "";

    Object.entries(PROJECTS).forEach(
      ([id, project]) => {

        const level = getProjectLevel(id);
        const cost = getProjectCost(id);

        const card =
          document.createElement("div");

        card.className = "project-card";
        card.dataset.project = id;

        let levelText;

        if (level === 0) {
          levelText = "Не построено";
        } else {
          levelText = `Уровень ${level}`;
        }


        let buttonText;

        if (cost === null) {
          buttonText = "МАКСИМУМ";
        } else if (level === 0) {
          buttonText =
            `ПОСТРОИТЬ · ${cost} млн`;
        } else {
          buttonText =
            `УЛУЧШИТЬ · ${cost} млн`;
        }


        card.innerHTML = `
          <div class="project-icon">
            ${project.icon}
          </div>

          <div class="project-info">
            <h3>${project.name}</h3>
            <p>${levelText}</p>
          </div>

          <button
            type="button"
            class="project-btn"
            data-project-id="${id}"
            ${cost === null ? "disabled" : ""}
          >
            ${buttonText}
          </button>
        `;


        projectsContainer.appendChild(card);
      }
    );


    // Обработчики кнопок
    const buttons =
      projectsContainer.querySelectorAll(
        ".project-btn"
      );


    buttons.forEach(button => {

      button.addEventListener(
        "click",
        function () {

          const id =
            this.getAttribute(
              "data-project-id"
            );

          buildProject(id);
        }
      );

    });
  }


  // =========================
  // ПОСТРОЙКА
  // =========================

  function buildProject(id) {

    if (state.gameOver) {
      return;
    }

    if (!state.started) {
      return;
    }

    if (state.eventOpen) {
      showToast("Сначала закройте событие");
      return;
    }


    const project = PROJECTS[id];

    if (!project) {
      return;
    }


    const level =
      getProjectLevel(id);

    const cost =
      getProjectCost(id);


    if (cost === null) {
      showToast("🏗️ Максимальный уровень");
      return;
    }


    if (state.money < cost) {
      showToast("💸 Недостаточно денег");
      return;
    }


    // Списываем деньги
    state.money -= cost;


    // Повышаем уровень
    state.projects[id] = level + 1;


    // Эффекты
    const multiplier =
      level === 0 ? 1 : 0.55;


    Object.entries(project.effects)
      .forEach(([metric, value]) => {

        const effect =
          Math.round(value * multiplier);

        changeMetric(metric, effect);
      });


    const message =
      level === 0
        ? `${project.icon} Построен объект: ${project.name}`
        : `${project.icon} Улучшен объект: ${project.name}`;


    addNews(message);
    showToast(message);


    // Обновляем интерфейс
    render();
    updateMap();


    // Один проект = один ход
    setTimeout(() => {
      nextTurn();
    }, 450);
  }
    // =========================
  // ОБНОВЛЕНИЕ ИНТЕРФЕЙСА
  // =========================

  function updateTurn() {
    if (!turnEl) return;

    const currentTurn =
      Math.min(state.turn, state.maxTurns);

    turnEl.textContent =
      `${currentTurn} / ${state.maxTurns}`;
  }


  function updateBudget() {
    if (moneyEl) {
      moneyEl.textContent =
        formatMoney(state.money);
    }

    if (incomePerTurnEl) {
      const income = getIncome();
      const expenses = getExpenses();
      const balance = income - expenses;

      if (balance >= 0) {
        incomePerTurnEl.textContent =
          `+${balance} млн ₸ / ход`;
      } else {
        incomePerTurnEl.textContent =
          `${balance} млн ₸ / ход`;
      }
    }
  }


  function updateMetrics() {
    Object.entries(metricEls).forEach(
      ([metric, elements]) => {

        if (!elements) return;

        const value =
          Math.round(state.metrics[metric]);


        if (elements.value) {
          elements.value.textContent =
            `${value}%`;
        }


        if (elements.bar) {
          elements.bar.style.width =
            `${value}%`;
        }
      }
    );
  }


  function renderNews() {
    if (!newsList) return;

    newsList.innerHTML = "";


    state.news.slice(0, 6).forEach(
      message => {

        const item =
          document.createElement("div");

        item.className = "news-item";
        item.textContent = message;

        newsList.appendChild(item);
      }
    );


    if (newsTurn) {
      newsTurn.textContent =
        `Ход ${Math.min(
          state.turn,
          state.maxTurns
        )}`;
    }
  }


  // =========================
  // ОБНОВЛЕНИЕ КАРТЫ
  // =========================

  function updateMap() {
    if (!projectObjects) return;

    projectObjects.innerHTML = "";


    Object.entries(state.projects).forEach(
      ([id, level]) => {

        if (level <= 0) return;


        const project = PROJECTS[id];

        if (!project) return;


        const position = project.position;

        if (
          !Array.isArray(position) ||
          position.length < 2
        ) {
          return;
        }


        const x = position[0];
        const y = position[1];


        const group =
          document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
          );


        group.setAttribute(
          "class",
          "project-object"
        );


        group.setAttribute(
          "transform",
          `translate(${x}, ${y})`
        );


        const circle =
          document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
          );


        circle.setAttribute("cx", "0");
        circle.setAttribute("cy", "0");
        circle.setAttribute("r", "24");


        const icon =
          document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
          );


        icon.setAttribute("x", "0");
        icon.setAttribute("y", "7");
        icon.setAttribute(
          "text-anchor",
          "middle"
        );
        icon.setAttribute("font-size", "22");

        icon.textContent = project.icon;


        const levelText =
          document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
          );


        levelText.setAttribute("x", "0");
        levelText.setAttribute("y", "42");
        levelText.setAttribute(
          "text-anchor",
          "middle"
        );
        levelText.setAttribute(
          "font-size",
          "11"
        );

        levelText.textContent =
          `ур. ${level}`;


        group.appendChild(circle);
        group.appendChild(icon);
        group.appendChild(levelText);

        projectObjects.appendChild(group);
      }
    );
  }


  // =========================
  // ОБЩИЙ RENDER
  // =========================

  function render() {
    updateTurn();
    updateBudget();
    updateMetrics();
    renderNews();
    createProjectCards();
  }


  // =========================
  // СОБЫТИЯ
  // =========================

  function randomEvent() {

    if (state.gameOver) {
      return;
    }

    if (state.eventOpen) {
      return;
    }


    // 45% шанс события
    if (Math.random() > 0.45) {
      return;
    }


    const index =
      Math.floor(
        Math.random() * EVENTS.length
      );


    const event = EVENTS[index];

    if (!event) {
      return;
    }


    showEvent(event);
  }


  function showEvent(event) {

    if (!eventModal) {
      return;
    }


    state.eventOpen = true;


    if (eventTag) {
      eventTag.textContent =
        event.tag || "СОБЫТИЕ";
    }


    if (eventIcon) {
      eventIcon.textContent =
        event.icon || "⚠️";
    }


    if (eventTitle) {
      eventTitle.textContent =
        event.title;
    }


    if (eventDescription) {
      eventDescription.textContent =
        event.description;
    }


    if (eventChoices) {

      eventChoices.innerHTML = "";


      event.choices.forEach(
        (choice, index) => {

          const button =
            document.createElement("button");


          button.type = "button";
          button.className =
            "event-choice";


          button.textContent =
            choice.text;


          button.addEventListener(
            "click",
            () => {
              chooseEvent(
                event,
                index
              );
            }
          );


          eventChoices.appendChild(button);
        }
      );
    }


    eventModal.classList.add("show");
  }


  function chooseEvent(
    event,
    choiceIndex
  ) {

    if (!state.eventOpen) {
      return;
    }


    const choice =
      event.choices[choiceIndex];


    if (!choice) {
      return;
    }


    const cost =
      Number(choice.cost) || 0;


    // Проверяем деньги
    if (cost > state.money) {
      showToast(
        "💸 Недостаточно денег"
      );
      return;
    }


    // Списываем стоимость
    if (cost > 0) {
      state.money -= cost;
    }


    // Меняем показатели
    if (choice.effects) {

      Object.entries(
        choice.effects
      ).forEach(
        ([metric, value]) => {

          changeMetric(
            metric,
            Number(value) || 0
          );
        }
      );
    }


    // Дополнительные деньги
    if (choice.money) {
      state.money +=
        Number(choice.money) || 0;
    }


    // Новость
    if (choice.news) {
      addNews(choice.news);
    } else {
      addNews(
        `${event.icon || "⚠️"} ${event.title}`
      );
    }


    closeEvent();


    render();
    updateMap();
    saveGame();
  }


  function closeEvent() {

    state.eventOpen = false;


    if (eventModal) {
      eventModal.classList.remove("show");
    }
  }


  // =========================
  // СЛЕДУЮЩИЙ ХОД
  // =========================

  function nextTurn() {

    if (state.gameOver) {
      return;
    }

    if (!state.started) {
      return;
    }

    if (state.eventOpen) {
      return;
    }


    const income =
      getIncome();

    const expenses =
      getExpenses();

    const balance =
      income - expenses;


    // Финансы
    state.money += balance;


    // Естественные изменения
    if (state.metrics.economy >= 70) {
      changeMetric(
        "happiness",
        1
      );
    }


    if (state.metrics.ecology < 35) {
      changeMetric(
        "health",
        -1
      );
    }


    if (state.metrics.mobility < 35) {
      changeMetric(
        "happiness",
        -1
      );
    }


    // Население
    const average =
      (
        state.metrics.happiness +
        state.metrics.economy +
        state.metrics.health
      ) / 3;


    if (average >= 70) {

      state.population += 2500;

    } else if (average >= 50) {

      state.population += 800;

    } else {

      state.population -= 400;
    }


    // Новости бюджета
    if (state.money < 0) {

      changeMetric(
        "economy",
        -3
      );

      changeMetric(
        "happiness",
        -4
      );

      addNews(
        "⚠️ Город ушёл в бюджетный дефицит."
      );

    } else if (balance > 0) {

      addNews(
        `💰 Бюджет получил +${balance} млн ₸.`
      );

    } else if (balance < 0) {

      addNews(
        `📉 Расходы превысили доходы на ${Math.abs(balance)} млн ₸.`
      );
    }


    // Переходим на следующий ход
    state.turn++;


    render();
    updateMap();
    saveGame();


    // 20 ходов закончились
    if (state.turn > state.maxTurns) {
      finishGame();
      return;
    }


    // Небольшая задержка перед событием
    setTimeout(() => {

      if (
        !state.gameOver &&
        state.started &&
        !state.eventOpen
      ) {
        randomEvent();
      }

    }, 350);
  }
    // =========================
  // ФИНАЛЬНЫЙ СЧЁТ
  // =========================

  function calculateScore() {

    const average =
      (
        state.metrics.happiness +
        state.metrics.ecology +
        state.metrics.mobility +
        state.metrics.education +
        state.metrics.health +
        state.metrics.economy
      ) / 6;


    const moneyBonus =
      clamp(
        state.money / 100,
        0,
        10
      );


    return Math.round(
      clamp(
        average + moneyBonus,
        0,
        100
      )
    );
  }


  // =========================
  // КОНЕЦ ИГРЫ
  // =========================

  function finishGame() {

    state.gameOver = true;
    state.started = false;
    state.eventOpen = false;


    const score =
      calculateScore();


    if (finalScore) {
      finalScore.textContent =
        `${score}/100`;
    }


    if (finalHappiness) {
      finalHappiness.textContent =
        `${Math.round(
          state.metrics.happiness
        )}%`;
    }


    if (finalEcology) {
      finalEcology.textContent =
        `${Math.round(
          state.metrics.ecology
        )}%`;
    }


    if (finalEconomy) {
      finalEconomy.textContent =
        `${Math.round(
          state.metrics.economy
        )}%`;
    }


    // Завершённую игру больше
    // не сохраняем
    localStorage.removeItem(
      SAVE_KEY
    );


    if (finishModal) {
      finishModal.classList.add("show");
    }
  }


  // =========================
  // СОХРАНЕНИЕ
  // =========================

  function saveGame() {

    try {

      const data = {

        turn: state.turn,

        maxTurns: state.maxTurns,

        money: state.money,

        metrics: {
          ...state.metrics
        },

        population:
          state.population,

        projects: {
          ...state.projects
        },

        news: [
          ...state.news
        ],

        started:
          state.started,

        gameOver:
          state.gameOver
      };


      localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(data)
      );

    } catch (error) {

      console.error(
        "Ошибка сохранения игры:",
        error
      );
    }
  }


  // =========================
  // ЗАГРУЗКА СОХРАНЕНИЯ
  // =========================

  function loadGame() {

    try {

      const raw =
        localStorage.getItem(
          SAVE_KEY
        );


      if (!raw) {
        return false;
      }


      const data =
        JSON.parse(raw);


      if (
        !data ||
        typeof data !== "object"
      ) {
        return false;
      }


      if (
        typeof data.turn !== "number" ||
        typeof data.money !== "number" ||
        !data.metrics ||
        !data.projects
      ) {
        return false;
      }


      state.turn =
        data.turn;

      state.maxTurns =
        data.maxTurns || 20;

      state.money =
        data.money;


      state.metrics = {
        ...state.metrics,
        ...data.metrics
      };


      state.population =
        typeof data.population === "number"
          ? data.population
          : 120000;


      state.projects = {
        ...data.projects
      };


      state.news =
        Array.isArray(data.news)
          ? data.news
          : [];


      state.gameOver =
        Boolean(data.gameOver);


      state.started =
        Boolean(data.started);


      if (
        state.gameOver ||
        state.turn > state.maxTurns
      ) {

        localStorage.removeItem(
          SAVE_KEY
        );

        return false;
      }


      return true;

    } catch (error) {

      console.error(
        "Ошибка загрузки:",
        error
      );

      localStorage.removeItem(
        SAVE_KEY
      );

      return false;
    }
  }


  // =========================
  // НОВАЯ ИГРА
  // =========================

  function resetGame() {

    localStorage.removeItem(
      SAVE_KEY
    );


    state.turn = 1;
    state.maxTurns = 20;

    state.money = 1200;


    state.metrics = {
      happiness: 60,
      ecology: 55,
      mobility: 50,
      education: 45,
      health: 50,
      economy: 55
    };


    state.population = 120000;

    state.projects = {};


    state.news = [
      "Город просыпается. Жители ждут ваших решений.",
      "Акимат получил новый бюджет.",
      "Начинается первый рабочий месяц."
    ];


    state.started = false;
    state.eventOpen = false;
    state.gameOver = false;


    if (eventModal) {
      eventModal.classList.remove(
        "show"
      );
    }


    if (finishModal) {
      finishModal.classList.remove(
        "show"
      );
    }


    if (startScreen) {
      startScreen.classList.remove(
        "hidden"
      );
    }


    if (startBtn) {
      startBtn.textContent =
        "НАЧАТЬ ИГРУ →";
    }


    render();
    updateMap();
  }


  // =========================
  // СТАРТ
  // =========================

  function startGame() {

    if (state.gameOver) {
      resetGame();
    }


    state.started = true;
    state.gameOver = false;


    if (startScreen) {
      startScreen.classList.add(
        "hidden"
      );
    }


    addNews(
      "🏙️ Вы вступили в должность акима."
    );


    render();
    updateMap();
    saveGame();
  }


  // =========================
  // СТАРТОВАЯ КНОПКА
  // =========================

  if (startBtn) {

    startBtn.addEventListener(
      "click",
      () => {
        startGame();
      }
    );
  }


  // =========================
  // ПЕРВИЧНЫЙ ЗАПУСК
  // =========================

  const hasSave =
    loadGame();


  /*
    ВАЖНО:

    При каждом обновлении страницы
    сначала показываем стартовый экран.

    Если сохранение существует,
    игрок может нажать "ПРОДОЛЖИТЬ".
  */

  if (startScreen) {
    startScreen.classList.remove(
      "hidden"
    );
  }


  if (hasSave) {

    if (startBtn) {
      startBtn.textContent =
        "ПРОДОЛЖИТЬ →";
    }

  } else {

    // Если сохранения нет —
    // начинаем полностью новую игру.
    resetGame();

  }


  // =========================
  // ДОПОЛНИТЕЛЬНАЯ КНОПКА
  // "НОВАЯ ИГРА"
  // =========================

  if (hasSave && startScreen) {

    const oldButton =
      document.getElementById(
        "newGameBtn"
      );


    if (!oldButton) {

      const newGameBtn =
        document.createElement(
          "button"
        );


      newGameBtn.id =
        "newGameBtn";

      newGameBtn.type =
        "button";

      newGameBtn.textContent =
        "НОВАЯ ИГРА";


      newGameBtn.addEventListener(
        "click",
        () => {

          resetGame();

          newGameBtn.remove();

        }
      );


      startScreen.appendChild(
        newGameBtn
      );
    }
  }


  // =========================
  // ПЕРВОНАЧАЛЬНЫЙ РЕНДЕР
  // =========================

  render();
  updateMap();


  // =========================
  // ДОСТУП ДЛЯ ОТЛАДКИ
  // =========================

  window.meroCity = {

    state: state,

    startGame: startGame,

    resetGame: resetGame,

    saveGame: saveGame,

    loadGame: loadGame
  };

});