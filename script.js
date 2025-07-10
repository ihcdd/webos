
// ОС 95 - Ретро Web OS

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('start-menu-button');
  const startMenu = document.getElementById('start-menu');
  const notepadWindow = document.getElementById('notepad-window');
  const settingsWindow = document.getElementById('settings-window');
  const terminalWindow = document.getElementById('terminal-window');
  const icons = document.getElementById('icons');

  // Меню Пуск
  startButton.addEventListener('click', () => {
    startMenu.classList.toggle('hidden');
  });

  // Закрытие окон
  document.querySelectorAll('.close-window').forEach(btn => {
    btn.addEventListener('click', e => {
      const wnd = document.getElementById(e.target.dataset.window);
      if (wnd) wnd.classList.add('hidden');
    });
  });

  // Открытие приложений с иконок и меню Пуск
  document.getElementById('icon-notepad').addEventListener('click', () => openWindow(notepadWindow));
  document.getElementById('open-notepad').addEventListener('click', () => openWindow(notepadWindow));

  document.getElementById('icon-settings').addEventListener('click', () => openWindow(settingsWindow));
  document.getElementById('open-settings').addEventListener('click', () => openWindow(settingsWindow));

  document.getElementById('icon-terminal').addEventListener('click', () => openWindow(terminalWindow));

  document.getElementById('logout').addEventListener('click', () => alert('Завершение сеанса...'));
  document.getElementById('shutdown').addEventListener('click', () => alert('Выключение...'));

  function openWindow(wnd) {
    wnd.classList.remove('hidden');
    startMenu.classList.add('hidden');
  }

  // Блокнот: управление цветом текста
  const notepadText = document.getElementById('notepad-text');
  const colors = ['#39ff14', '#00ffff', '#ff00ff', '#ff1493'];
  let currentColorIndex = 0;

  document.getElementById('color-btn').addEventListener('click', () => {
    currentColorIndex = (currentColorIndex + 1) % colors.length;
    notepadText.style.color = colors[currentColorIndex];
    notepadText.style.textShadow = \`0 0 5px \${colors[currentColorIndex]}, 0 0 10px \${colors[currentColorIndex]}\`;
    // caret-color sync
    notepadText.style.caretColor = colors[currentColorIndex];
  });

  // Очистить блокнот
  document.getElementById('clear-btn').addEventListener('click', () => {
    notepadText.value = '';
  });

  // Сохранить в sessionStorage
  document.getElementById('save-btn').addEventListener('click', () => {
    sessionStorage.setItem('os95-notepad', notepadText.value);
    alert('Текст сохранён в сессии браузера.');
  });

  // Загрузка текста из sessionStorage при старте
  if(sessionStorage.getItem('os95-notepad')) {
    notepadText.value = sessionStorage.getItem('os95-notepad');
  }

  // Импорт TXT
  const fileInput = document.getElementById('file-input');
  document.getElementById('import-btn').addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if(file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = () => {
        notepadText.value = reader.result;
      };
      reader.readAsText(file);
    } else {
      alert('Пожалуйста, выберите текстовый файл (.txt).');
    }
  });

  // Экспорт TXT
  document.getElementById('export-btn').addEventListener('click', () => {
    const blob = new Blob([notepadText.value], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notepad.txt';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  });

  // Курсор
  const cursorStyles = ['▌', '_', '█'];
  let currentCursorIndex = 0;
  const cursorBtn = document.getElementById('cursor-style-btn');

  cursorBtn.addEventListener('click', () => {
    currentCursorIndex = (currentCursorIndex + 1) % cursorStyles.length;
    cursorBtn.textContent = \`Курсор: \${cursorStyles[currentCursorIndex]}\`;
  });

  // Эффект мигающего курсора
  let cursorVisible = true;
  setInterval(() => {
    if(document.activeElement === notepadText) {
      if(cursorVisible) {
        notepadText.style.caretColor = colors[currentColorIndex];
      } else {
        notepadText.style.caretColor = 'transparent';
      }
      cursorVisible = !cursorVisible;
    } else {
      notepadText.style.caretColor = colors[currentColorIndex];
      cursorVisible = true;
    }
  }, 500);

  // Смена фона
  const bgStyles = ['чёрный', 'сканлайн', 'зелёный терминал'];
  let currentBgIndex = 1;
  const bgBtn = document.getElementById('bg-style-btn');

  function applyBgStyle() {
    notepadText.classList.remove('bg-scanlines', 'bg-green-terminal');
    if(bgStyles[currentBgIndex] === 'сканлайн') {
      notepadText.classList.add('bg-scanlines');
      notepadText.style.backgroundColor = '#111';
      notepadText.style.color = colors[currentColorIndex];
    } else if(bgStyles[currentBgIndex] === 'зелёный терминал') {
      notepadText.classList.add('bg-green-terminal');
    } else {
      notepadText.style.backgroundColor = '#111';
      notepadText.style.color = colors[currentColorIndex];
    }
  }

  bgBtn.addEventListener('click', () => {
    currentBgIndex = (currentBgIndex + 1) % bgStyles.length;
    bgBtn.textContent = \`Фон: \${bgStyles[currentBgIndex]}\`;
    applyBgStyle();
  });

  applyBgStyle();

  // Терминал (простейшая имитация)
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');

  terminalInput.addEventListener('keydown', e => {
    if(e.key === 'Enter') {
      e.preventDefault();
      processTerminalCommand(terminalInput.value.trim());
      terminalInput.value = '';
    }
  });

  function processTerminalCommand(cmd) {
    if(!cmd) return;
    let output = '';
    const args = cmd.split(' ');
    switch(args[0].toLowerCase()) {
      case 'помощь':
        output = 'Доступные команды: помощь, файлы, открыть <имя>, очистить, выход';
        break;
      case 'файлы':
        output = '- файл1.txt
- заметки.doc
- отчет.pdf';
        break;
      case 'открыть':
        if(args.length > 1) {
          output = \`Открываю файл: \${args.slice(1).join(' ')}\`;
        } else {
          output = 'Укажите имя файла.';
        }
        break;
      case 'очистить':
        terminalOutput.textContent = '';
        return;
      case 'выход':
        document.getElementById('terminal-window').classList.add('hidden');
        return;
      default:
        output = \`Неизвестная команда: \${cmd}\`;
    }
    terminalOutput.textContent += output + '\n';
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }
});
