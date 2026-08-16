        function toggleTheme() {

            const html = document.documentElement;

            html.classList.toggle('dark');

            const isDark = html.classList.contains('dark');

            localStorage.setItem(
                'datahub-theme',
                isDark ? 'dark' : 'light'
            );

            document.getElementById('themeIcon').textContent =
                isDark ? '☼' : '☾';
        }


        function loadTheme() {

            const saved = localStorage.getItem('datahub-theme');

            if (saved === 'light') {
                document.documentElement.classList.remove('dark');
                document.getElementById('themeIcon').textContent = '☾';
            } else {
                document.documentElement.classList.add('dark');
                document.getElementById('themeIcon').textContent = '☀';
            }

        }

        loadTheme();