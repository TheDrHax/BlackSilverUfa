<%def name="code()">
<code class="highlighter-rouge">${caller.body()}</code>
</%def>

<%def name="code_block()">
<div class="highlighter-rouge"><div class="highlight">
  <pre class="highlight"><code>${caller.body()}</code></pre>
</div></div>
</%def>
