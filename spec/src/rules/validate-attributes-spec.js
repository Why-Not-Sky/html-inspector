describe("validate-attributes", function() {

  var log

  function onComplete(reports) {
    log = []
    reports.forEach(function(report) {
      log.push(report)
    })
  }

  it("warns when obsolete attributes of elements appear in the HTML", function() {

    var $html = $(''
          + '<div align="center">'
          + '  <section>'
          + '     <h1>Title</h1>'
          + '     <h2 align="right">Subtitle</h2>'
          + '     <p>foo <br clear="both"> bar</p>'
          + '  </section>'
          + '  <hr color="red">'
          + '  <ul type="foo">'
          + '    <li>blah</li>'
          + '  </ul>'
          + '</div>'
        )

    HTMLInspector.inspect({
      useRules: ["validate-attributes"],
      domRoot: $html,
      onComplete: onComplete
    })

    expect(log.length).toBe(5)
    expect(log[0].message).toBe("The 'align' attribute is no longer valid on the <div> element and should not be used.")
    expect(log[0].context).toBe($html[0])
    expect(log[1].message).toBe("The 'align' attribute is no longer valid on the <h2> element and should not be used.")
    expect(log[1].context).toBe($html.find("h2")[0])
    expect(log[2].message).toBe("The 'clear' attribute is no longer valid on the <br> element and should not be used.")
    expect(log[2].context).toBe($html.find("br")[0])
    expect(log[3].message).toBe("The 'color' attribute is no longer valid on the <hr> element and should not be used.")
    expect(log[3].context).toBe($html.find("hr")[0])
    expect(log[4].message).toBe("The 'type' attribute is no longer valid on the <ul> element and should not be used.")
    expect(log[4].context).toBe($html.find("ul")[0])

  })

  it("warns when invalid attributes of elements appear in the HTML", function() {

    var $html = $(''
          + '<div foo="bar">'
          + '  <section action="http://example.com">'
          + '     <h1>Title</h1>'
          + '     <h2 cell-padding="1">Subtitle</h2>'
          + '     <p>foo <br blah="true"> bar</p>'
          + '  </section>'
          + '</div>'
        )

    HTMLInspector.inspect({
      useRules: ["validate-attributes"],
      domRoot: $html,
      onComplete: onComplete
    })

    expect(log.length).toBe(4)
    expect(log[0].message).toBe("'foo' is not a valid attribute of the <div> element.")
    expect(log[0].context).toBe($html[0])
    expect(log[1].message).toBe("'action' is not a valid attribute of the <section> element.")
    expect(log[1].context).toBe($html.find("section")[0])
    expect(log[2].message).toBe("'cell-padding' is not a valid attribute of the <h2> element.")
    expect(log[2].context).toBe($html.find("h2")[0])
    expect(log[3].message).toBe("'blah' is not a valid attribute of the <br> element.")
    expect(log[3].context).toBe($html.find("br")[0])

  })

  it("warns when required attributes are missing", function() {

    var $html = $(''
          + '<div>'
          + '  <img class="foo" />'
          + '  <form>'
          + '     <textarea><textarea>'
          + '  </form>'
          + '</div>'
        )

    HTMLInspector.inspect({
      useRules: ["validate-attributes"],
      domRoot: $html,
      onComplete: onComplete
    })

    expect(log.length).toBe(5)
    expect(log[0].message).toBe("The 'alt' attribute is required for <img> elements.")
    expect(log[0].context).toBe($html.find("img")[0])
    expect(log[1].message).toBe("The 'src' attribute is required for <img> elements.")
    expect(log[1].context).toBe($html.find("img")[0])
    expect(log[2].message).toBe("The 'action' attribute is required for <form> elements.")
    expect(log[2].context).toBe($html.find("form")[0])
    expect(log[3].message).toBe("The 'cols' attribute is required for <textarea> elements.")
    expect(log[3].context).toBe($html.find("textarea")[0])
    expect(log[4].message).toBe("The 'rows' attribute is required for <textarea> elements.")
    expect(log[4].context).toBe($html.find("textarea")[0])

  })

  it("doesn't double-warn when an element is both invalid and obsolete", function() {

    var $html = $(''
          + '<div align="center">'
          + '   <h1>Title</h1>'
          + '   <h2>Subtitle</h2>'
          + '</div>'
        )

    HTMLInspector.inspect({
      useRules: ["validate-attributes"],
      domRoot: $html,
      onComplete: onComplete
    })

    expect(log.length).toBe(1)
  })

  it("doesn't warn when valid, non-obsolete elements are used", function() {

    var $html = $(''
          + '<div class="foo" data-foo="bar" role="main">'
          + '  <span id="bar">Foo</span>'
          + '  <a aria-foo="bar" href="#">Foo</a>'
          + '</div>'
        )

    HTMLInspector.inspect({
      useRules: ["validate-attributes"],
      domRoot: $html,
      onComplete: onComplete
    })

    expect(log.length).toBe(0)

  })

})