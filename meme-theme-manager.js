class MemeThemeManager {
    constructor() {
        this.themes = {
            default: {
                name: 'Default',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '--primary-color': '#667eea',
                    '--primary-dark': '#5a67d8',
                    '--secondary-color': '#764ba2',
                    '--accent-color': '#48bb78'
                }
            },
            ocean: {
                name: 'Ocean',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #006d77 0%, #83c5be 100%)',
                    '--primary-color': '#006d77',
                    '--primary-dark': '#005f69',
                    '--secondary-color': '#83c5be',
                    '--accent-color': '#ffddd2'
                }
            },
            sunset: {
                name: 'Sunset',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%)',
                    '--primary-color': '#ff6b6b',
                    '--primary-dark': '#e55353',
                    '--secondary-color': '#ffa726',
                    '--accent-color': '#4ecdc4'
                }
            },
            forest: {
                name: 'Forest',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #2d5016 0%, #a4ac86 100%)',
                    '--primary-color': '#2d5016',
                    '--primary-dark': '#1e3510',
                    '--secondary-color': '#a4ac86',
                    '--accent-color': '#c9ada7'
                }
            },
            royal: {
                name: 'Royal',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)',
                    '--primary-color': '#4c1d95',
                    '--primary-dark': '#3c1a78',
                    '--secondary-color': '#7c3aed',
                    '--accent-color': '#fbbf24'
                }
            },
            win30: {
                name: 'Windows 3.0',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #c0c0c0 0%, #808080 100%)',
                    '--primary-color': '#0000ff',
                    '--primary-dark': '#000080',
                    '--secondary-color': '#c0c0c0',
                    '--accent-color': '#ff0000',
                    '--white': '#ffffff',
                    '--gray-50': '#f0f0f0',
                    '--gray-100': '#e0e0e0',
                    '--gray-200': '#c0c0c0',
                    '--gray-300': '#808080',
                    '--gray-700': '#404040',
                    '--gray-800': '#202020'
                }
            },
            win98: {
                name: 'Windows 98',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #008080 0%, #c0c0c0 100%)',
                    '--primary-color': '#008080',
                    '--primary-dark': '#006666',
                    '--secondary-color': '#c0c0c0',
                    '--accent-color': '#ff0000',
                    '--white': '#ffffff',
                    '--gray-50': '#f8f8f8',
                    '--gray-100': '#e8e8e8',
                    '--gray-200': '#d4d4d4',
                    '--gray-300': '#b8b8b8',
                    '--gray-700': '#505050',
                    '--gray-800': '#303030'
                }
            },
            winxp: {
                name: 'Windows XP',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #0078d4 0%, #40e0d0 100%)',
                    '--primary-color': '#0078d4',
                    '--primary-dark': '#005a9e',
                    '--secondary-color': '#40e0d0',
                    '--accent-color': '#ff6b35',
                    '--white': '#ffffff',
                    '--gray-50': '#f0f8ff',
                    '--gray-100': '#e6f3ff',
                    '--gray-200': '#cce7ff',
                    '--gray-300': '#99d6ff',
                    '--gray-700': '#2c5282',
                    '--gray-800': '#1a365d'
                }
            },
            gameboy: {
                name: 'GameBoy Classic',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #8bac0f 0%, #306230 100%)',
                    '--primary-color': '#8bac0f',
                    '--primary-dark': '#306230',
                    '--secondary-color': '#9bbc0f',
                    '--accent-color': '#0f380f',
                    '--white': '#9bbc0f',
                    '--gray-50': '#8bac0f',
                    '--gray-100': '#8bac0f',
                    '--gray-200': '#306230',
                    '--gray-300': '#0f380f',
                    '--gray-700': '#0f380f',
                    '--gray-800': '#0f380f'
                }
            },
            msdos: {
                name: 'MS-DOS Terminal',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #00ff00 0%, #008000 100%)',
                    '--primary-color': '#00ff00',
                    '--primary-dark': '#00cc00',
                    '--secondary-color': '#008000',
                    '--accent-color': '#ffff00',
                    '--white': '#000000',
                    '--gray-50': '#001100',
                    '--gray-100': '#002200',
                    '--gray-200': '#003300',
                    '--gray-300': '#004400',
                    '--gray-700': '#00ff00',
                    '--gray-800': '#00ff00'
                }
            },
            nokia1100: {
                name: 'Nokia 1100 (2003)',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #000000 0%, #333333 100%)',
                    '--primary-color': '#000000',
                    '--primary-dark': '#000000',
                    '--secondary-color': '#333333',
                    '--accent-color': '#ffffff',
                    '--white': '#ffffff',
                    '--gray-50': '#f0f0f0',
                    '--gray-100': '#e0e0e0',
                    '--gray-200': '#cccccc',
                    '--gray-300': '#999999',
                    '--gray-700': '#333333',
                    '--gray-800': '#000000'
                }
            },
            nokia1110: {
                name: 'Nokia 1110 (2005)',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #90ee90 0%, #228b22 100%)',
                    '--primary-color': '#228b22',
                    '--primary-dark': '#006400',
                    '--secondary-color': '#90ee90',
                    '--accent-color': '#32cd32',
                    '--white': '#f0fff0',
                    '--gray-50': '#f0fff0',
                    '--gray-100': '#e6ffe6',
                    '--gray-200': '#ccffcc',
                    '--gray-300': '#99ff99',
                    '--gray-700': '#228b22',
                    '--gray-800': '#006400'
                }
            },
            iphone6: {
                name: 'iPhone 6 (2014)',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #007aff 0%, #5ac8fa 100%)',
                    '--primary-color': '#007aff',
                    '--primary-dark': '#0056b3',
                    '--secondary-color': '#5ac8fa',
                    '--accent-color': '#ff3b30',
                    '--white': '#ffffff',
                    '--gray-50': '#faf9f7',
                    '--gray-100': '#e5e5ea',
                    '--gray-200': '#d1d1d6',
                    '--gray-300': '#c7c7cc',
                    '--gray-700': '#8e8e93',
                    '--gray-800': '#1c1c1e'
                }
            },
            iphone6s: {
                name: 'iPhone 6S (2015)',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #e6c2a6 0%, #d4af37 100%)',
                    '--primary-color': '#d4af37',
                    '--primary-dark': '#b8860b',
                    '--secondary-color': '#e6c2a6',
                    '--accent-color': '#ff69b4',
                    '--white': '#ffffff',
                    '--gray-50': '#faf9f7',
                    '--gray-100': '#e5e5ea',
                    '--gray-200': '#d1d1d6',
                    '--gray-300': '#c7c7cc',
                    '--gray-700': '#8e8e93',
                    '--gray-800': '#1c1c1e'
                }
            },
            iphone7: {
                name: 'iPhone 7 (2016)',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #1c1c1e 0%, #007aff 100%)',
                    '--primary-color': '#1c1c1e',
                    '--primary-dark': '#000000',
                    '--secondary-color': '#007aff',
                    '--accent-color': '#30d158',
                    '--white': '#ffffff',
                    '--gray-50': '#f2f2f7',
                    '--gray-100': '#e5e5ea',
                    '--gray-200': '#d1d1d6',
                    '--gray-300': '#c7c7cc',
                    '--gray-700': '#8e8e93',
                    '--gray-800': '#1c1c1e'
                }
            },
            iphonexr: {
                name: 'iPhone XR (2018)',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #ff6347 0%, #ff4500 100%)',
                    '--primary-color': '#ff6347',
                    '--primary-dark': '#ff4500',
                    '--secondary-color': '#ffa500',
                    '--accent-color': '#32cd32',
                    '--white': '#ffffff',
                    '--gray-50': '#fff8f5',
                    '--gray-100': '#ffede5',
                    '--gray-200': '#fed7cc',
                    '--gray-300': '#fdab9a',
                    '--gray-700': '#cc5239',
                    '--gray-800': '#8b3626'
                }
            },
            nokia3210: {
                name: 'Nokia 3210 (1999)',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #4169e1 0%, #87ceeb 100%)',
                    '--primary-color': '#4169e1',
                    '--primary-dark': '#0000cd',
                    '--secondary-color': '#87ceeb',
                    '--accent-color': '#ffff00',
                    '--white': '#f0f8ff',
                    '--gray-50': '#f0f8ff',
                    '--gray-100': '#e6f3ff',
                    '--gray-200': '#cce7ff',
                    '--gray-300': '#99d6ff',
                    '--gray-700': '#2c5282',
                    '--gray-800': '#1a365d'
                }
            },
            nokia1200: {
                name: 'Nokia 1200 (2007)',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #4682b4 0%, #add8e6 100%)',
                    '--primary-color': '#4682b4',
                    '--primary-dark': '#2f4f4f',
                    '--secondary-color': '#add8e6',
                    '--accent-color': '#00bfff',
                    '--white': '#f0f8ff',
                    '--gray-50': '#f0f8ff',
                    '--gray-100': '#e1f0ff',
                    '--gray-200': '#b3d9ff',
                    '--gray-300': '#85c1ff',
                    '--gray-700': '#2c5282',
                    '--gray-800': '#1a365d'
                }
            },
            samsunge1100: {
                name: 'Samsung E1100 (2009)',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #696969 0%, #dcdcdc 100%)',
                    '--primary-color': '#696969',
                    '--primary-dark': '#2f2f2f',
                    '--secondary-color': '#dcdcdc',
                    '--accent-color': '#ff6347',
                    '--white': '#ffffff',
                    '--gray-50': '#f8f8ff',
                    '--gray-100': '#f0f0f0',
                    '--gray-200': '#e0e0e0',
                    '--gray-300': '#c0c0c0',
                    '--gray-700': '#696969',
                    '--gray-800': '#2f2f2f'
                }
            },
            iphone5s: {
                name: 'iPhone 5S (2013)',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #007aff 0%, #f0f0f0 100%)',
                    '--primary-color': '#007aff',
                    '--primary-dark': '#0056b3',
                    '--secondary-color': '#f0f0f0',
                    '--accent-color': '#ff3b30',
                    '--white': '#ffffff',
                    '--gray-50': '#fafafa',
                    '--gray-100': '#f0f0f0',
                    '--gray-200': '#e0e0e0',
                    '--gray-300': '#c0c0c0',
                    '--gray-700': '#8e8e93',
                    '--gray-800': '#1c1c1e'
                }
            },
            motorolarazrv3: {
                name: 'Motorola RAZR V3 (2004)',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #c0c0c0 0%, #ff69b4 100%)',
                    '--primary-color': '#c0c0c0',
                    '--primary-dark': '#808080',
                    '--secondary-color': '#ff69b4',
                    '--accent-color': '#00bfff',
                    '--white': '#f8f8ff',
                    '--gray-50': '#f8f8ff',
                    '--gray-100': '#e6e6fa',
                    '--gray-200': '#d3d3d3',
                    '--gray-300': '#a9a9a9',
                    '--gray-700': '#696969',
                    '--gray-800': '#2f2f2f'
                }
            },
            iphone12: {
                name: 'iPhone 12 / 12 Pro (2020)',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #000000 0%, #1d1d1f 100%)',
                    '--primary-color': '#007aff',
                    '--primary-dark': '#0056b3',
                    '--secondary-color': '#1d1d1f',
                    '--accent-color': '#30d158',
                    '--white': '#ffffff',
                    '--gray-50': '#f2f2f7',
                    '--gray-100': '#e5e5ea',
                    '--gray-200': '#d1d1d6',
                    '--gray-300': '#c7c7cc',
                    '--gray-700': '#8e8e93',
                    '--gray-800': '#000000'
                }
            },
            galaxys4: {
                name: 'Samsung Galaxy S4 (2013)',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #4a90e2 0%, #7ed321 100%)',
                    '--primary-color': '#4a90e2',
                    '--primary-dark': '#357abd',
                    '--secondary-color': '#7ed321',
                    '--accent-color': '#50e3c2',
                    '--white': '#ffffff',
                    '--gray-50': '#f0f8ff',
                    '--gray-100': '#e1f0ff',
                    '--gray-200': '#b3d9ff',
                    '--gray-300': '#7dc8ff',
                    '--gray-700': '#2c5282',
                    '--gray-800': '#1a365d'
                }
            },
            iphone11: {
                name: 'iPhone 11 (2019)',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
                    '--primary-color': '#a855f7',
                    '--primary-dark': '#9333ea',
                    '--secondary-color': '#3b82f6',
                    '--accent-color': '#10b981',
                    '--white': '#ffffff',
                    '--gray-50': '#faf5ff',
                    '--gray-100': '#f3e8ff',
                    '--gray-200': '#e9d5ff',
                    '--gray-300': '#d8b4fe',
                    '--gray-700': '#7c2d92',
                    '--gray-800': '#581c87'
                }
            },
            galaxys3: {
                name: 'Samsung Galaxy S III (2012)',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #2563eb 0%, #e0e7ff 100%)',
                    '--primary-color': '#2563eb',
                    '--primary-dark': '#1d4ed8',
                    '--secondary-color': '#e0e7ff',
                    '--accent-color': '#06b6d4',
                    '--white': '#ffffff',
                    '--gray-50': '#f8fafc',
                    '--gray-100': '#f1f5f9',
                    '--gray-200': '#e2e8f0',
                    '--gray-300': '#cbd5e1',
                    '--gray-700': '#475569',
                    '--gray-800': '#334155'
                }
            },
            nokia6600: {
                name: 'Nokia 6600 (2003)',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #8b4513 0%, #deb887 100%)',
                    '--primary-color': '#8b4513',
                    '--primary-dark': '#654321',
                    '--secondary-color': '#deb887',
                    '--accent-color': '#d2691e',
                    '--white': '#fff8dc',
                    '--gray-50': '#fff8dc',
                    '--gray-100': '#faebd7',
                    '--gray-200': '#f5deb3',
                    '--gray-300': '#deb887',
                    '--gray-700': '#8b4513',
                    '--gray-800': '#654321'
                }
            },
            iphonex: {
                name: 'iPhone X (2017)',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #1c1c1e 0%, #007aff 100%)',
                    '--primary-color': '#007aff',
                    '--primary-dark': '#0056b3',
                    '--secondary-color': '#1c1c1e',
                    '--accent-color': '#ff9500',
                    '--white': '#ffffff',
                    '--gray-50': '#f2f2f7',
                    '--gray-100': '#e5e5ea',
                    '--gray-200': '#d1d1d6',
                    '--gray-300': '#c7c7cc',
                    '--gray-700': '#8e8e93',
                    '--gray-800': '#1c1c1e'
                }
            },
            galaxynote: {
                name: 'Samsung Galaxy Note (2011)',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #374151 0%, #6b7280 100%)',
                    '--primary-color': '#374151',
                    '--primary-dark': '#1f2937',
                    '--secondary-color': '#6b7280',
                    '--accent-color': '#f59e0b',
                    '--white': '#ffffff',
                    '--gray-50': '#f9fafb',
                    '--gray-100': '#f3f4f6',
                    '--gray-200': '#e5e7eb',
                    '--gray-300': '#d1d5db',
                    '--gray-700': '#374151',
                    '--gray-800': '#1f2937'
                }
            },
            blackberrybold: {
                name: 'BlackBerry Bold 9000 (2008)',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #000000 0%, #dc2626 100%)',
                    '--primary-color': '#000000',
                    '--primary-dark': '#000000',
                    '--secondary-color': '#dc2626',
                    '--accent-color': '#ffffff',
                    '--white': '#ffffff',
                    '--gray-50': '#f8f8f8',
                    '--gray-100': '#e0e0e0',
                    '--gray-200': '#c0c0c0',
                    '--gray-300': '#808080',
                    '--gray-700': '#404040',
                    '--gray-800': '#000000'
                }
            },
            htconem8: {
                name: 'HTC One M8 (2014)',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #9ca3af 0%, #ff7f00 100%)',
                    '--primary-color': '#9ca3af',
                    '--primary-dark': '#6b7280',
                    '--secondary-color': '#ff7f00',
                    '--accent-color': '#22d3ee',
                    '--white': '#ffffff',
                    '--gray-50': '#f8fafc',
                    '--gray-100': '#f1f5f9',
                    '--gray-200': '#e2e8f0',
                    '--gray-300': '#cbd5e1',
                    '--gray-700': '#475569',
                    '--gray-800': '#334155'
                }
            }
        };
        this.currentTheme = 'default';
        this.loadSavedTheme();
    }

    applyTheme(themeName) {
        if (!this.themes[themeName]) {
            console.warn(`Theme ${themeName} not found`);
            return;
        }

        const theme = this.themes[themeName];
        const root = document.documentElement;

        Object.entries(theme.colors).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });

        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${themeName}`);

        this.currentTheme = themeName;
        this.saveTheme(themeName);
    }

    getAvailableThemes() {
        return Object.entries(this.themes).map(([key, theme]) => ({
            key,
            name: theme.name
        }));
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    saveTheme(themeName) {
        localStorage.setItem('selectedMemeTheme', themeName);
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('selectedMemeTheme');
        if (savedTheme && this.themes[savedTheme]) {
            this.applyTheme(savedTheme);
        }
    }

    resetToDefault() {
        this.applyTheme('default');
    }
}