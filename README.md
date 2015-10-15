# pur

Alias and glob powered asynchronous shell execution.

![Demo](/demo.gif)

The main margin is color in alternating colors to help distinguish the outputs
of each command.  The secondary margin is colored to help distinguish output 
types: stdout and stdin is colored gray, while stderr is colored red.

## Installation 

```
npm install -g pur
```

## Usage

Basic usage:

```
pur [glob or alias] command [--save alias]
```

### Examples

#### Globbing

Run ls in each directory inside the `~/ipython` folder:
```
pur ~/ipython/*/ ls
```

Run ls in each directory inside both the `~/ipython` and `~/jupyter` folders:
```
pur ~/{ipython,jupyter}/*/ ls
```

### Path shortcuts
To save a shortcut for the glob results, append `--save <shortcut>` at the end of 
your command.

Run ls in and save the `~/ipython/*/` folders as the shortcut `ipy`:
```
pur ~/ipython/*/ ls --save ipy
```

Now you can use the `ipy` shortcut instead of typing `~/ipython/*/`:
```
pur ipy ls
```

### Default shortcut
If you use a path set very frequently, you can save it as a `default` shortcut.
This will make pur use it when no other path is specified.

Run ls in each directory inside both the `~/ipython` and `~/jupyter` folders, 
and save the folders as the `default`:

```
pur ~/{ipython,jupyter}/*/ ls --save default
```

Now, when no path is specified, the `~/ipython` and `~/jupyter` subfolders will
be used.  The following command is now a short version of the above:

```
pur ls
```

### Alias resolution
On operating systems that support bash aliases (OSX and Linux tested), pur will
attempt to resolve the first word in your command as an alias.  For example, on
my machine I have `co` registered as an alias for `git checkout`.  To checkout
origin/master in all the directories of my `default` shortcut I can run:

```
pur co origin/master
```
