# Dropdown WIP

In order to use the dropdown custom element you need to import the element in the document's head:
```html
<link href="tk-dropdown.min.css" rel="stylesheet">
<script src="tk-dropdown.min.js"></script>
```

The simplified version of the custom elements
```html
<button class="btn btn-secondary" id="dropdownMenuButton">
	Dropdown button
</button>


<tk-dropdown for="#dropdownMenuButton">
	<a class="dropdown-item" href="#">Action</a>
	<a class="dropdown-item" href="#">Another action</a>
	<a class="dropdown-item" href="#">Something else here</a>
</tk-dropdown>
```

### Dropdown demo:

<div class="mermaid">
<button class="btn btn-secondary" id="dropdownMenuButton">
Dropdown button
</button>


<tk-dropdown for="#dropdownMenuButton">
<a class="dropdown-item" href="#">Action</a>
<a class="dropdown-item" href="#">Another action</a>
<a class="dropdown-item" href="#">Something else here</a>
</tk-dropdown>
</div>
