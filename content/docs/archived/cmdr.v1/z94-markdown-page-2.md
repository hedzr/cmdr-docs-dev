---
title: Markdown Page II
---


[markdown-it.github.io](https://markdown-it.github.io/)

# h1 Heading 8-)

## h2 Heading

### h3 Heading

#### h4 Heading

##### h5 Heading

###### h6 Heading

## Horizontal Rules

___

---

***

## Typographic replacements

Enable typographer option to see result.

(c) (C) (r) (R) (tm) (TM) (p) (P) +-

test.. test... test..... test?..... test!....

!!!!!! ???? ,,  -- ---

"Smartypants, double quotes" and 'single quotes'

## Emphasis

**This is bold text**

**This is bold text**

*This is italic text*

*This is italic text*

~~Strikethrough~~

## Blockquotes

> Blockquotes can also be nested...
> > ...by using additional greater-than signs right next to each other...
> >
> > > ...or with spaces between arrows.

## Lists

Unordered

+ Create a list by starting a line with `+`, `-`, or `*`
+ Sub-lists are made by indenting 2 spaces:
  + Marker character change forces new list start:
    + Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet

    + Nulla volutpat aliquam velit
+ Very easy!

Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa

1. You can use sequential numbers...
1. ...or keep all the numbers as `1.`

Start numbering with offset:

57. foo
1. bar

## Code

Inline `code`

Indented code

    // Some comments
    line 1 of code
    line 2 of code
    line 3 of code

Block code "fences"

```plain
Sample text here...
```

Syntax highlighting

```js
var foo = function (bar) {
  return bar++;
};

console.log(foo(5));
```

## Tables

| Option | Description                                                  |
| ------ | ------------------------------------------------------------ |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files.                         |

Right aligned columns

| Option |                                                  Description |
| -----: | -----------------------------------------------------------: |
|   data | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
|    ext |                         extension to be used for dest files. |

## Links

[link text](http://dev.nodeca.com)

[link with title](http://nodeca.github.io/pica/demo/) -- "title text!" --

Autoconverted link [https://github.com/nodeca/pica](https://github.com/nodeca/pica)) (enable linkify to see)

## Images

![Minion](/images/cmdr/minion.png)
![Stormtroopocat](/images/cmdr/stormtroopocat.png) -- "The Stormtroopocat" --

Like links, Images also have a footnote style syntax

`![Alt text][id]`

With a reference later in the document defining the URL location:

[//]: # (## Plugins)

[//]: # ()
[//]: # (The killer feature of `markdown-it` is very effective support of)

[//]: # ([syntax plugins]&#40;https://www.npmjs.org/browse/keyword/markdown-it-plugin&#41;.)

[//]: # (### Emojies)

[//]: # ()
[//]: # ([Emojies]&#40;https://github.com/markdown-it/markdown-it-emoji&#41;,)

[//]: # ()
[//]: # (> Classic markup: :wink: :crush: :cry: :tear: :laughing: :yum:)

[//]: # (>)

[//]: # (> Shortcuts &#40;emoticons&#41;: :-&#41; :-&#40; 8-&#41; ;&#41;)

[//]: # ()
[//]: # (see [how to change output]&#40;https://github.com/markdown-it/markdown-it-emoji#change-output&#41; with twemoji.)

### Subscript / Superscript

[Subscript](https://github.com/markdown-it/markdown-it-sub) / [Superscript](https://github.com/markdown-it/markdown-it-sup)

+ 19^th^
+ H~2~O

### `<ins>`

[`<ins>`](https://github.com/markdown-it/markdown-it-ins)

++Inserted text++

### `<mark>`

[`<mark>`](https://github.com/markdown-it/markdown-it-mark)

==Marked text==

### Footnotes

[Footnotes](https://github.com/markdown-it/markdown-it-footnote)

Footnote 1 link[^first].

Footnote 2 link[^second].

Inline footnote^[Text of inline footnote] definition.

Duplicated footnote reference[^second].

[^first]: Footnote **can have markup**

    and multiple paragraphs.

[^second]: Footnote text.

[//]: # (### Definition lists)

[//]: # ()
[//]: # ([Definition lists]&#40;https://github.com/markdown-it/markdown-it-deflist&#41;)

[//]: # ()
[//]: # (Term 1)

[//]: # ()
[//]: # (:   Definition 1)

[//]: # (with lazy continuation.)

[//]: # ()
[//]: # (Term 2 with *inline markup*)

[//]: # ()
[//]: # (:   Definition 2)

[//]: # ()
[//]: # (        { some code, part of Definition 2 })

[//]: # (    )
[//]: # (    Third paragraph of definition 2.)

[//]: # ()
[//]: # (*Compact style:*)

[//]: # ()
[//]: # (Term 1)

[//]: # (  ~ Definition 1)

[//]: # ()
[//]: # (Term 2)

[//]: # (  ~ Definition 2a)

[//]: # (  ~ Definition 2b)

[//]: # ()
[//]: # (### Abbreviations)

[//]: # ()
[//]: # (This is HTML [Abbreviations]&#40;https://github.com/markdown-it/markdown-it-abbr&#41; example.)

[//]: # ()
[//]: # (It converts "HTML", but keep intact partial entries like "xxxHTMLyyy" and so on.)

[//]: # ()
[//]: # (*[HTML]: Hyper Text Markup Language)

[//]: # ()
[//]: # (### Custom containers)

[//]: # ()
[//]: # ([Custom containers]&#40;https://github.com/markdown-it/markdown-it-container&#41;)

[//]: # ()
[//]: # (::: warning)

[//]: # (*here be dragons*)

[//]: # (:::)

🔚
