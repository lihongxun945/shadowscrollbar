# shadowbar
### what is shadow bar
shadowbar is a jquery scrollbar plugin
but it doesn't listen mouse and touch event to scroll the element, instead it listen to the native scroll event and use js to draw a mac-lion style scrollbar. I use css3 border-radius to draw the scrollbar, so in ie8- the scrollbar is a rectangle;
in short, it just hide the native scrollbar and draw a shadow of it.
the advantage is that: it won't change the native scroller behaviour
the disadvantage is that: it change the dom tree, so you can't listen scroll event of the container, instead you must listen to shadowbar's scroll event;
I find facebook's inbox opoup window use this method, so I just write a jQuery plugin to implement.
### example:
$("#container").shadowbar({color:"#ff0000"}); //create shadowbar, args is the optional settings;
 // if shadowbar was create, but the content change(ie: use js to change the innerHTML), you can use the following method to update the scrollbar:
 $("#container").shadowbar("update");

### TODOS:
 * scroll event
 * allow mouse drag the scrollbar.
 
### copy right:
 autor: axun
 time: 2012/10/3

