# tinkerloop

A tiny CLI tool to run `php artisan tinker` in an infinite loop with clean restarts. Useful when you're frequently testing Laravel code and want the REPL to instantly restart after exit.

Built in TypeScript.

---

## 🔧 Installation

### Development (Local)

Clone and link it globally:

```bash
git clone https://github.com/melkmeshi/tinkerloop.git
cd tinkerloop
npm install
npm run build
npm link
````

Now you can run `tinkerloop` anywhere.

---

## 🚀 Usage

```bash
tinkerloop [project-path] [--dir PATH] [--php PHP_BINARY] [--backoff MS]
```

### Examples

```bash
# Run in current directory
tinkerloop

# Run in specific Laravel app directory
tinkerloop ~/Sites/my-laravel-app

# Customize PHP binary and backoff delay between restarts
tinkerloop --php /usr/local/bin/php --backoff 500
```

---

## 🛠 Options

| Option            | Description                              | Default     |
| ----------------- | ---------------------------------------- | ----------- |
| `[project-path]`  | Path to Laravel app (where `artisan` is) | Current dir |
| `--dir`, `-d`     | Alternate way to specify the path        | Current dir |
| `--php`           | PHP binary to use                        | `php`       |
| `--backoff`, `-b` | Milliseconds between restarts            | `250`       |
| `--help`, `-h`    | Show help message                        | —           |

---

## ⚠️ Warning

This tool runs `php artisan tinker` in an **infinite loop**. Be cautious when using it in environments where CPU usage matters or logging noise should be avoided.

---

## 👨‍💻 Development

Standard TypeScript project layout.

```bash
# compile TS -> JS
npm run build

# run from source without installing
node dist/index.js ~/path/to/laravel/project
```

---

## 📦 Publishing

To publish this as a global CLI tool on npm:

1. Make sure your package name is unique in `package.json`.
2. Log in to npm:

   ```bash
   npm login
   ```
3. Publish it:

   ```bash
   npm publish
   ```

After that, others can install it globally with:

```bash
npm install -g tinkerloop
```

---

## 📄 License

MIT
