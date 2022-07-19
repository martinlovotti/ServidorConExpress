const express = require("express");
const app = express();
const PORT = 8080;
const frase = "hola como estan?";
let productos = [];

app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.get("/api/productos", (req,res)=>{
    if(productos.length === 0){
        res.json({
            error: "No hay productos"
        })
    }
    res.json(productos)
})

app.get("/api/productos/:id", (req, res) => {
    const id = req.params.id
    let enc = productos.find(item=>item.id == id)
    if (enc){
        res.json(enc)}
    else{
        res.json({error: "no se encontró el producto"})
    }    
});

  app.post("/api/productos", (req,res)=>{
    let producto = req.body;
    if (Object.entries(producto).length === 0 || Object.entries(producto).length < 3){
        res.status(422).json({ error: 'No se pudo obtener los atributos del producto correctamente.'});
    }else{
        const ids = productos.map(item => item.id);
        console.log(ids)
        if(ids.length === 0){
            producto.id = 1;
        }else{
            let maxId = Math.max(...ids);
            producto.id = maxId + 1;
        }
        productos.push(producto);
        res.status(201).json({ productoAgregado: producto });
    }
})

app.put("/api/productos/:id", (req,res)=>{
    const id = req.params.id
    if (productos.length === 0){
        res.json({ error: 'No se encontraron productos.'});
    }else{
        if (productos.length >= id){
            const index = productos.findIndex(producto => producto.id == id);
            productos = productos.filter(producto => producto.id != id);
            let newProduct = req.body;
            newProduct.id = parseInt(id);
            productos.splice(index, 1, newProduct);
            res.json({ productoActualizado: newProduct });
        }else{
            res.json({ error: 'Producto no encontrado' });
        }
    }
})

app.delete("/api/productos/:id", (req,res)=>{
    const id = req.params.id;
        if (productos.length === 0){
            res.json({ error: 'No se encontraron productos.'});
        }else{
            if (productos.length >= id){
                productos = productos.filter(producto => producto.id != id);
                res.json({ productosRestantes: productos });
            }else{
                res.json({ error: 'Producto no encontrado', productosRestantes: productos });
            }
        }
})


const server = app.listen(PORT, () => {console.log(`Servidor http escuchando en el puerto ${PORT}`);});
server.on("error", (error) => console.log(`Error en servidor ${error}`));