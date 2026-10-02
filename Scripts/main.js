const CONFIG_FORMAT_ON_SAVE = 'christopherknewton.SwiftFormat.formatOnSave'
const CONFIG_EXECUTABLE = 'christopherknewton.SwiftFormat.executablePath'

exports.activate = function () {
  nova.commands.register(
    'christopherknewton.SwiftFormat.formatDocument',
    editor => formatEditor(editor)
  )

  nova.workspace.onDidAddTextEditor(editor => {
    editor.onWillSave(editor => {
      if (editor.document.syntax !== 'swift') return
      if (!nova.config.get(CONFIG_FORMAT_ON_SAVE, 'boolean')) return

      return formatEditor(editor)
    })
  })
}

exports.deactivate = function () {}

async function formatEditor(editor) {
  const document = editor.document
  const range = new Range(0, document.length)
  const original = document.getTextInRange(range)

  try {
    const formatted = await runSwiftFormat(original, document.path)

    if (formatted.length === 0 && original.length > 0) return
    if (formatted === original) return

    await editor.edit(edit => edit.replace(range, formatted))
  } catch (error) {
    console.error(`swift format: ${error.message}`)
  }
}

function runSwiftFormat(text, path) {
  return new Promise((resolve, reject) => {
    const executable =
      nova.config.get(CONFIG_EXECUTABLE, 'string') || '/usr/bin/swift'

    const args = ['format']
    if (path) args.push('--assume-filename', path)

    const options = { args, stdio: ['pipe', 'pipe', 'pipe'] }
    if (nova.workspace.path) options.cwd = nova.workspace.path

    const process = new Process(executable, options)
    const stdout = []
    const stderr = []

    process.onStdout(line => stdout.push(line))
    process.onStderr(line => stderr.push(line))

    process.onDidExit(status => {
      if (status === 0) {
        resolve(stdout.join(''))
      } else {
        const message = stderr.join('').trim()
        reject(new Error(message || `exited with status ${status}`))
      }
    })

    try {
      process.start()
    } catch (error) {
      reject(error)
      return
    }

    const writer = process.stdin.getWriter()
    writer.write(text)
    writer.close()
  })
}
