# 🧱 React Grid

A lightweight, flexible, and responsive data grid component for modern React applications.

![npm](https://img.shields.io/npm/v/@raghuraj-singh/react-grid)
![license](https://img.shields.io/npm/l/@raghuraj-singh/react-grid)
![downloads](https://img.shields.io/npm/dw/@raghuraj-singh/react-grid)

---

## 🚀 Installation

Install the package using npm:

```bash
npm install @raghuraj-singh/react-grid
or
yarn add @raghuraj-singh/react-grid
```

## 📦 Features
- 📐 Responsive and mobile-friendly
- 🧩 Highly configurable grid layout
- 🎯 Supports sorting, filtering, and searching
- ⚡ Built-in pagination and action handlers
- 🛠️ Built with TypeScript

## ⚙️ Basic Usage

> import Grid from '@raghuraj-singh/react-grid';
 
> function App() {
>   const gridProps = {
>     items: [],
>     mobileDataProps: {
>       title: 'Name',
>       primaryDescription: ['PlantCode', 'FunctionalLocationName'],
>       secondaryDescription: [
>         {
>           item1: 'SerialId',
>           item2: 'ModelDescription',
>           separator: '|'
>         }
>       ]
>     },
>     columns: [
>       { name: 'Plant Code', field: 'PlantCode', sortable: true },
>       { name: 'Asset', field: 'Name', sortable: true },
>       { name: 'Site', field: 'FunctionalLocationName', sortable: true },
>       { name: 'Manufacturer serial number', field: 'SerialId', sortable: true },
>       { name: 'Model', field: 'ModelDescription', sortable: false },
>       { name: '', field: '', sortable: false }
>     ],
>     actions: {
>       callBack: redirectToAssetDetail,
>       label: 'Create quote'
>     },
>     filters: [
>       {
>         allLabel: 'All Sites',
>         field: 'FunctionalLocationName',
>         type: 'string'
>       },
>       {
>         allLabel: 'All Models',
>         field: 'ModelDescription',
>        type: 'string'
>       }
>     ],
>     searchFields: ['PlantCode', 'Name', 'FunctionalLocationName', 'SerialId', 'ModelDescription'],
>     pageSize: 8
>   };

>   return (
>     <div className="App">
>       <Grid {...gridProps} />
>     </div>
>   );
> }

> const redirectToAssetDetail = (rowData) => {
>   window.location.href = `?serialId=${rowData.SerialId}&assetId=${rowData.Name}`;
> };

> export default App;
