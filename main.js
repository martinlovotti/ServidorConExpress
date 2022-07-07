//Servidores

const express = require("express");
const app = express();
const PORT = 8080;
let productos = [];
let r;
app.get("/productos", (req, res) => {
    res.send(`Los productos disponibles son los siguientes ${productos}`);
})

app.get("/productosRandom", (req, res) => {
    res.send(`Un producto disponible es el siguiente ${productos[Math.floor((Math.random() * productos.length))]}`);
});
const server = app.listen(PORT, () => {console.log(`Servidor http escuchando en el puerto ${PORT}`);});
server.on("error", (error) => console.log(`Error en servidor ${error}`));

const fs = require ('fs');
let id = 1;
let arrayObj = [];

class Contenedor {
    constructor(archivo){
        this.archivo = archivo
    }

    async save(Object){
        try {
            if (await this.getAll() === false){
                Object.id = id;
                arrayObj.push(Object)
                await fs.promises.writeFile(this.archivo,JSON.stringify(arrayObj,null,2))
                console.log('Producto Cargado')
            }else{
                const datas = await this.getAll()
                console.log(datas)
                if(datas.length === 0){
                    Object.id = id;
                    
                }
                else{
                    let ultElement = datas[datas.length - 1]
                    if(ultElement.id >= 1){
                        Object.id = ultElement.id + 1
                    }else{
                        Object.id = 1
                    }
                }
                datas.push(Object)
                await fs.promises.writeFile(this.archivo,JSON.stringify(datas,null,2))
                console.log('Producto Cargado')
            }

        } catch (error) {
            console.log('No se pudo cargar')
        }
    } 

    async getById(number){
        try {
            const data = JSON.parse(await fs.promises.readFile(this.archivo, 'utf-8'))
            const objId = data.find(item => item.id === number)
            if(objId){
                console.log(objId)
            }else{
                console.log(null)
            }
            return objId
        } catch (error) {
            
        }
    }
    async getAll(){
        try {
           const data = JSON.parse(await fs.promises.readFile(this.archivo, 'utf-8')) 
           for (let index = 0; index < data.length; index++) {
            productos.push(data[index].title)
           }
           return data
        } catch (error) {
            console.log(error)
            return false  
        }
    }

    async deleteById(number){
        try {
            const deleteID = await this.getById(number)
            const data = await this.getAll()
            const nuevoArray = data.filter(item => item.id != deleteID.id)
            await fs.promises.writeFile(this.archivo,JSON.stringify(nuevoArray,null,2))
            console.log('producto eliminado')
        } catch (error) {
            
        }
    }

    async deleteAll(){
        try {
            const data = await this.getAll();
            data.splice(0,data.length)
            await fs.promises.writeFile(this.archivo,JSON.stringify(data,null,2))
        } catch (error) {
            
        }
    }
}

const contenedor = new Contenedor('./productos.txt');
const producto = {
    title: 'Producto 1',
    price: 200,
    thumbnail: 'producto1.jpg'
}
/*
contenedor.deleteById(5)
contenedor.deleteAll() */
/* contenedor.save(producto)  */
contenedor.getAll()
