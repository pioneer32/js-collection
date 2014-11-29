# js-collection

## Checkbox groups controller (native JS)
=============

Just add follow line to your &lt;HEAD&gt; section:
>&lt;script type="text/javascript" src="pathToCheckboxGroupsFile/checkboxGroups.js"&gt;&lt;/script&gt;
>

Sample HTML code:

>A: &lt;input class="chkbx-gr-a" type="checkbox" /&gt;&lt;br/&gt;<br/>
>B: &lt;input class="chkbx-gr-a" type="checkbox" /&gt;&lt;br/&gt;<br/>
>C: &lt;input class="chkbx-gr-a" type="checkbox" /&gt;&lt;br/&gt;<br/>
>D: &lt;input class="chkbx-gr-a" type="checkbox" /&gt;&lt;&lt;br/&gt;<br/>
>
>
>Master: &lt;input class="cm chkbx-gr-a chkbx-gr-master" type="checkbox" /&gt;&lt;br/&gt;


If not all of A,B,C,D is checked then master will give class "undef"

Change event are forwarding, if you change master, all A,B,C,D fire event "change"
