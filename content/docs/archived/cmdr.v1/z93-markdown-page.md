---
title: Markdown Page I
---

[quick-markdown-example](http://www.unexpected-vortices.com/sw/rippledoc/quick-markdown-example.html)

An h1 header
============

Paragraphs are separated by a blank line.

2nd paragraph. *Italic*, **bold**, and `monospace`. Itemized lists
look like:

* this one
* that one
* the other one

Note that --- not considering the asterisk --- the actual text
content starts at 4-columns in.

> Block quotes are
> written like so.
>
> They can span multiple paragraphs,
> if you like.

Use 3 dashes for an em-dash. Use 2 dashes for ranges (ex., "it's all
in chapters 12--14"). Three dots ... will be converted to an ellipsis.
Unicode is supported. ☺

An h2 header
------------

Here's a numbered list:

 1. first item
 2. second item
 3. third item

[//]: # (Note again how the actual text starts at 4 columns in &#40;4 characters)

[//]: # (from the left side&#41;. Here's a code sample:)

[//]: # ()
[//]: # (    # Let me re-iterate ...)

[//]: # (    for i in 1 .. 10 { do-something&#40;i&#41; })

[//]: # ()
[//]: # (As you probably guessed, indented 4 spaces. By the way, instead of)

[//]: # (indenting the block, you can use delimited blocks, if you like:)

[//]: # ()
[//]: # (~~~)

[//]: # (define foobar&#40;&#41; {)

[//]: # (    print "Welcome to flavor country!";)

[//]: # (})

[//]: # (~~~)

[//]: # ()
[//]: # (&#40;which makes copying & pasting easier&#41;. You can optionally mark the)

[//]: # (delimited block for Pandoc to syntax highlight it:)

[//]: # ()
[//]: # (~~~python)

[//]: # (import time)

[//]: # (# Quick, count to ten!)

[//]: # (for i in range&#40;10&#41;:)

[//]: # (    # &#40;but not *too* quick&#41;)

[//]: # (    time.sleep&#40;0.5&#41;)

[//]: # (    print&#40;i&#41;)

[//]: # (~~~)

[//]: # ()
[//]: # (### An h3 header ###)

[//]: # ()
[//]: # (Now a nested list:)

[//]: # ()
[//]: # ( 1. First, get these ingredients:)

[//]: # ()
[//]: # (      * carrots)

[//]: # (      * celery)

[//]: # (      * lentils)

[//]: # ()
[//]: # ( 2. Boil some water.)

[//]: # ()
[//]: # ( 3. Dump everything in the pot and follow)

[//]: # (    this algorithm:)

[//]: # ()
[//]: # (        find wooden spoon)

[//]: # (        uncover pot)

[//]: # (        stir)

[//]: # (        cover pot)

[//]: # (        balance wooden spoon precariously on pot handle)

[//]: # (        wait 10 minutes)

[//]: # (        goto first step &#40;or shut off burner when done&#41;)

[//]: # ()
[//]: # (    Do not bump wooden spoon or it will fall.)

[//]: # ()
[//]: # (Notice again how text always lines up on 4-space indents &#40;including)

[//]: # (that last line which continues item 3 above&#41;.)

[//]: # ()
[//]: # (Here's a link to [a website]&#40;http://foo.bar&#41;, to a [local)

[//]: # (doc]&#40;./ref&#41;, and to a [section heading in the current)

[//]: # (doc]&#40;#an-h2-header&#41;. Here's a footnote [^1].)

[//]: # ()
[//]: # ([^1]: Some footnote text.)

[//]: # ()
[//]: # (Tables can look like this:)

[//]: # ()
[//]: # (Name           Size  Material      Color)

[//]: # (------------- -----  ------------  ------------)

[//]: # (All Business      9  leather       brown)

[//]: # (Roundabout       10  hemp canvas   natural)

[//]: # (Cinderella       11  glass         transparent)

[//]: # ()
[//]: # (Table: Shoes sizes, materials, and colors.)

[//]: # ()
[//]: # (&#40;The above is the caption for the table.&#41; Pandoc also supports)

[//]: # (multi-line tables:)

[//]: # ()
[//]: # (--------  -----------------------)

[//]: # (Keyword   Text)

[//]: # (--------  -----------------------)

[//]: # (red       Sunsets, apples, and)

[//]: # (          other red or reddish)

[//]: # (          things.)

[//]: # ()
[//]: # (green     Leaves, grass, frogs)

[//]: # (          and other things it's)

[//]: # (          not easy being.)

[//]: # (--------  -----------------------)

[//]: # (A horizontal rule follows.)

[//]: # ()
[//]: # (***)

[//]: # ()
[//]: # (Here's a definition list:)

[//]: # ()
[//]: # (apples)

[//]: # (  : Good for making applesauce.)

[//]: # ()
[//]: # (oranges)

[//]: # (  : Citrus!)

[//]: # ()
[//]: # (tomatoes)

[//]: # (  : There's no "e" in tomatoe.)

[//]: # ()
[//]: # (Again, text is indented 4 spaces. &#40;Put a blank line between each)

[//]: # (term and  its definition to spread things out more.&#41;)

[//]: # ()
[//]: # (Here's a "line block" &#40;note how whitespace is honored&#41;:)

[//]: # ()
[//]: # (| Line one)

[//]: # (|   Line too)

[//]: # (| Line tree)

[//]: # ()
[//]: # (and images can be specified like so:)

[//]: # ()
[//]: # (![example image]&#40;/cmdr/e0a5c0a2-f084-47a8-a41c-e3223146cd9e.jpg "An exemplary image"&#41;)

[//]: # ()
[//]: # (#### MathJax)

[//]: # ()
[//]: # (Inline math equation: $\omega = d\phi / dt$. Display)

[//]: # (math should get its own line like so:)

[//]: # ()
[//]: # ($$I = \int \rho R^{2} dV$$)

[//]: # ()
[//]: # (And note that you can backslash-escape any punctuation characters)

[//]: # (which you wish to be displayed literally, ex.: \`foo\`, \*bar\*, etc.)

[//]: # ()
[//]: # ($$)

[//]: # (\mathbb{E}&#40;X&#41; = \int x d F&#40;x&#41; = \left\{ \begin{aligned} \sum_x x f&#40;x&#41; \; & \text{ if } X \text{ is discrete})

[//]: # (\\ \int x f&#40;x&#41; dx \; & \text{ if } X \text{ is continuous })

[//]: # (\end{aligned} \right.)

[//]: # ($$)

[//]: # ()
[//]: # (Inline math $\frac{1}{2}$)

🔚
