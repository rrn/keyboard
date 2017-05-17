$(function() {
  var LanguageKeyboard = function() {
    var keys = {
      letters: [
        // Characters
        ['\u0259', 'Latin Small Letter Schwa'],
        ['\u025B', 'Latin Small Letter Open E'],
        ['\u00E6', 'Latin Small Letter Ae'],
        ['\u2022', 'Bullet'],
        ['\u03B8', 'Greek Small Letter Theta'],
        ['\u03BB', 'Greek Small Letter Lambda'],
        ['\u019B', 'Latin Small Letter Lambda with Stroke'],
        ['\u026C', 'Latin Small Letter L with Belt'],
        ['\u0142', 'Latin Small Letter L With Stroke'],
        ['\u0251', 'Latin Small Letter Alpha'],
        ['\u028C', 'Latin Small Letter Turned V'],
        ['\u0269', 'Latin Small Letter Iota'],
        ['\u028B', 'Latin Small Letter V with Hook'],
        ['\u03C7', 'Greek Small Letter Chi'],
        ['\u0294', 'Latin Letter Glottal stop'],
        ['\u01E5', 'Latin Small Letter G With Stroke'],
        ['\u01E4', 'Latin Capital G With Stroke'],
        ['\u0166', 'Latin Capital T With Stroke'],
        ['\u0167', 'Latin Small Letter T With Stroke'],
        ['\u203F', 'Undertie'],

        // Spacing Modifier Letters
        ['\u1DBF', 'Modifier Letter Small Theta'],
        ['\u02B7', 'Modifier Letter Small W'],
        ['\u1DBB', 'Modifier Letter Small Z'],
        ['\u1D4B', 'Modifier Letter Small Open E'],
        ['\u1D58', 'Modifier Letter Small U'],
        ['\u02B8', 'Modifier Letter Small Y'],
        ['\u02D0', 'Modifier Letter Triangular Colon'],
        ['\u02D1', 'Modifier Letter Half Triangular Colon'],
        ['\u02B0', 'Modifier Letter Small H']
      ],
      diacritics:[
        ['\u0301', 'Combining Acute Accent'],
        ['\u0300', 'Combining Grave Accent'],
        ['\u0313', 'Combining Comma Above'],
        ['\u0315', 'Combining Comma Above Right'],
        ['\u030C', 'Combining Caron'],
        ['\u0331', 'Combining Macron Below'],
        ['\u0304', 'Combining Macron'],
        ['\u0308', 'Combining Diaresis Above'],
        ['\u0324', 'Combining Diaeresis Below'],
        ['\u0323', 'Combining Dot Below'],
        ['\u0328', 'Combining Ogonek'],
        ['\u0361', 'Combining Double Inverted Breve']
      ]
    };

    function insertCharacter(character) {
      var input = $('input:focus, textarea:focus').get(0);
      if (input) {
        var selectionStart = input.selectionStart;
        var selectionEnd = input.selectionEnd;
        var front = input.value.substring(0, selectionStart);
        var back = input.value.substring(selectionEnd);
        input.value = front + character + back;
        input.selectionStart = selectionStart + character.length;
        input.selectionEnd = selectionStart + character.length;

        $(input).trigger('input');
      } else if (typeof CKEDITOR !== 'undefined' && typeof CKEDITOR.currentInstance !== 'undefined') {
        CKEDITOR.currentInstance.insertText(character);

        // HACK: Force re-rendering to place diacritics correctly
        CKEDITOR.currentInstance.insertText(' ');
        CKEDITOR.currentInstance.execCommand('undo');
      }
    }

    var keyboard = $('<div id="language-keyboard"></div>');

    var keyboardHeader = $('<span class="keyboard-close" title="Click to Close Keyboard">&#x2715;</span><div class="keyboard-header">First Nations Keyboard</div>');
    keyboard.append(keyboardHeader);

    var keyboardKeys = $('<div class="keyboard-keys"></div>')

    $.each(keys['letters'], function(i, glyph) {
      var key = $('<span class="keyboard-key" title="' + glyph[1] + '">' + glyph[0] + '</span>');
      keyboardKeys.append(key);

      key.click(function(event) {
        event.stopImmediatePropagation();
        insertCharacter(glyph[0]);
      });
    });

    keyboardKeys.append('<hr class="keyboard-separator" />');

    $.each(keys['diacritics'], function(i, glyph) {
      var key = $('<span class="keyboard-key" title="' + glyph[1] + '">&nbsp;' + glyph[0] + '</span>');
      keyboardKeys.append(key);

      key.click(function(event) {
        event.stopImmediatePropagation();
        insertCharacter(glyph[0]);
      });
    });

    keyboard.append(keyboardKeys);

    keyboard.on('mousedown', function(event){ event.preventDefault(); }); // Prevent unselection while clicking buttons
    keyboard.on('click', function(event){ event.stopPropagation(); }); // Prevent loss of focus
    keyboard.drags({handle: '.keyboard-header'});
    keyboard.on('click', '.keyboard-close', function(event){
      keyboard.hide();
    });

    $(document.body).append(keyboard);

    if ($(document).tooltip) {
      $('.keyboard-key').tooltip({ placement: 'bottom' });
    }

    $(document).on('mousedown', '[data-behaviour=show-keyboard]', function(event) {
      event.preventDefault(); // Prevent unselection while clicking buttons
    });

    $(document).on('click', '[data-behaviour=show-keyboard]', function(event) {
      event.stopPropagation(); // Prevent loss of focus
      keyboard.toggle();
    });
  };

  // Simple implementation of Drag and Drop
  // https://codepen.io/chriscoyier/pen/zdsty
  $.fn.drags = function(opt) {
    opt = $.extend({
      handle: "",
      cursor: "move"
    }, opt);

    if (opt.handle === "") {
      var $el = this;
    } else {
      var $el = this.find(opt.handle);
    }

    return $el.css('cursor', opt.cursor).on("mousedown", function(e) {
      if (opt.handle === "") {
        var $drag = $(this).addClass('draggable');
      } else {
        var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
      }
      var z_idx = $drag.css('z-index'),
        drg_h = $drag.outerHeight(),
        drg_w = $drag.outerWidth(),
        pos_y = $drag.offset().top + drg_h - e.pageY,
        pos_x = $drag.offset().left + drg_w - e.pageX;
      $drag.css('z-index', 2000).parents().on("mousemove", function(e) {
        $('.draggable').offset({
          top: e.pageY + pos_y - drg_h,
          left: e.pageX + pos_x - drg_w
        }).on("mouseup", function() {
          $(this).removeClass('draggable').css('z-index', z_idx);
        });
      });
      e.preventDefault(); // disable selection
    }).on("mouseup", function() {
      if (opt.handle === "") {
        $(this).removeClass('draggable');
      } else {
        $(this).removeClass('active-handle').parent().removeClass('draggable');
      }
    });
  };

  LanguageKeyboard();
});
