0.2.3 &ndash; 2014-11-27
------------------------

* Upgraded to React 0.12.1.

0.2.2 &ndash; 2014-03-23
------------------------

* Upgraded to React 0.10.0.

0.2.1 &ndash; 2014-02-21
------------------------

* Upgraded to React 0.9.0.

0.2.0 &ndash; 2014-02-07
------------------------

* **Backwards-incompatible change** &ndash; linebreaks are now stored as `<br>`
  rather than `\n` &ndash; long lines will now wrap.

* Fixed: clicking to edit one project name then another no longer copies the
  former's name to the latter.

* All HTML tags except the `<br>`s used for linebreaks are now stripped after
  editing a TODO. In browsers which insert a `<p>` or `<div>` when you press
  Enter in a `contentEditable`, these are normalised to `<br>` before saving.

* Sessions can now be switched on the fly without reloading the page.

* Added a quick session switching dropdown to the header, which activates when
  there are multiple sessions available.

* Added exporting of projects as a `.todo.txt` file.

* Added session management to the settings screen - add, rename and delete.

* Session switcher `<input>` on the Welcome page now uses a `<datalist>` to
  suggest completions for  existing session names from `localStorage`.

* The active session name is now displayed in `<title>`.

0.1.0 &ndash; 2014-01-28
------------------------

* Initial release.