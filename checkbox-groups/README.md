# js-collection

## Checkbox groups controller (native JS)
=============

Just add following line to your &lt;HEAD&gt; section:
```html
<script type="text/javascript" src="pathToCheckboxGroupsFile/checkboxGroups.js"></script>
```

Sample HTML code:
```html
A: <input class="chkbx-gr-a" type="checkbox" /><br/>
B: <input class="chkbx-gr-a" type="checkbox" /><br/>
C: <input class="chkbx-gr-a" type="checkbox" /><br/>
D: <input class="chkbx-gr-a" type="checkbox" /><<br/>

Master: <input class="cm chkbx-gr-a chkbx-gr-master" type="checkbox" />
```


If not all of A,B,C,D is checked then master will give class "undef"

Change event are forwarding, if you change master, all A,B,C,D fire event "change"
