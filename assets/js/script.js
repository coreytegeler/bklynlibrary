var $;

$ = jQuery;

$(function() {
  return $('body').on('click', '.accordion a', function(e) {
    var $accordion, $inside, $li, $link, $opened, insideHeight, linkHeight, newHeight;
    e.preventDefault();
    $link = $(this);
    $li = $link.parents('li');
    $inside = $li.find('.inside');
    $accordion = $li.parents('.accordion');
    linkHeight = $link.innerHeight();
    insideHeight = $inside.find('.chapter').innerHeight();
    console.log($inside);
    if ($li.is('.opened')) {
      newHeight = 0;
    } else {
      newHeight = insideHeight;
      if ($opened = $accordion.find('.opened')) {
        $opened.removeClass('opened');
        $opened.find('.inside').css({
          height: 0
        });
      }
    }
    $inside.css({
      height: newHeight
    });
    return $li.toggleClass('opened');
  });
});
