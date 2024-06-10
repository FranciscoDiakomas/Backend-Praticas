const { connection } = require('mongoose')

async function main() {
const express = require('express')
const mysql = require('mysql')
const bcrypt = require('bcrypt')
const validator = require('validator')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()



const app = express()
const port = process.env.PORT ||3030

//conexion com banco de dados
const DBOptions = {
    host : "localhost",
    user : "root",
    password : "",
    database : "Login"
}
const conexion = mysql.createConnection(DBOptions)
try {
    conexion.connect((err)=>{
    if(err){
        console.log(err)
    }else{
        console.log("Connectado com sucesso ao banco de dados!")
    }
})
} catch (error) {
    throw new Error(error)
}



//middlewares globais
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))



let sql = ""

//pagina inicial da API
app.get("/",(req,res)=>{
    res.json({
        msg : "Bem vindo na minha API de Login",
        status : "sucesso!"

    }).status(200)
})

//pegando todos usuários
app.get("/users",(req, res)=>{
    sql = "Select * from Users;"
    conexion.query(sql,(err,result)=>{
        if(err){
            res.json({
                msg : err,
                status :"error!"
            }).status(400)
        }else{
            if(result.length === 0){
                res.json({
                    msg : "O banco de dados esta vazio!",
                    status : "sucess!"
                }).status(200)
            }else{
                res.json({
                    msg : "Todos Usuários",
                    data : result,
                    status :"sucess"
                }).status(200)
            }
        }
    })

})


//pegando um usuário específico

app.get("/user/:id",(req,res)=>{
    let id = req.params.id
    sql = "select * from Users where id = ?;"
    conexion.query(sql,[id],(err, result)=>{
        if(err){
            res.json({
                msg : err,
                status :"error!"
            }).status(400)
        }else{
            if(result.length === 0){
                res.json({
                    msg : "Usuário não encotrado",
                    status : "sucesso!"
                }).status(200)
            }else{
                res.json({
                    msg : "Usuário encotrado",
                    data : result,
                    status :"sucess"
                }).status(200)
            }
        }
        
        
    })
})



//deletando um usúario
app.delete("/user/:id",(req,res)=>{
    let id = req.params.id
    sql = "select * from Users where id = ?;"
    conexion.query(sql,[id],(err, result)=>{
        if(err){
            res.json({
                msg : err,
                status :"error!"
            }).status(400)
        }else{
            if(result.length === 0){
                res.json({
                    msg : "Usuário não encotrado",
                    status : "sucesso!"
                }).status(200)
            }else{
                sql = "delete from user where id = ?"
                conexion.query(sql,[id],(err,resultado)=>{
                    if(err){
                    res.json({
                    msg : "Erro ao tentar elimiar o usuário",
                    status : "Error"
                }).status(400)
                }else{
                res.json({
                    msg : "Usuário Eliminado",
                    data : resultado,
                    status :"sucess"
                }).status(200)
                }

            })
        }
        }
        
        
    })

})



//cadastrando um usúario
app.post("/user",async(req,res)=>{
    const {nome , email, senha} = req.body
    if(String(nome).length === 0){
        res.json({
            msg : "Envia o nome",
            status : "error"
        }).status(400)
    }else if(String(email).length === 0){
        res.json({
            msg : "Envia o email",
            status : "error"
        }).status(400)
    }else if(String(senha).length === 0){
        res.json({
            msg : "Envia a senha",
            status : "error"
        }).status(400)
    }else{
        
        if(validator.isEmail(email)){
            let senhaEncriptada = await bcrypt.hash(senha,10)
            let data = [nome , email , senhaEncriptada]
            sql = "insert into Users(nome,email,senha) values (?);"
            conexion.query(sql,[data],(err,result)=>{
                if(err){
                    res.json({
                        msg : err,
                        status :"Email já foi utilizado, tente outro!"
                    }).status(400)
                }else{
                    res.json({
                        msg : "cadastrado com sucesso!",
                        status : "sucess",
                    })
                    
                }
            })

        }else{
            res.json({
                msg : "Email inválido",
                status : "Error"
            }).status(400)
        }
        
    }
})

//logar
app.get("/logar",(req,res)=>{
    let {email, senha} = req.body
    if(String(email).length === 0){
        res.json({
            msg : "Envia o email",
            status : "error"
        }).status(400)
    }else if(String(senha).length === 0){
        res.json({
            msg : "Envia a senha",
            status : "error"
        }).status(400)
    }else{
        if(validator.isEmail(email)){
            sql = "select senha from Users where email = ?;"
            conexion.query(sql, [email],async(err,resultado)=>{
                if(err){
                    res.json({
                        msg : "Esse email ja foi utilizado",
                        status :"Error"
                    }).status(400)

                }else{
                    if(resultado.length === 0){
                        res.json({
                        msg : "Email não encotrado",
                        status :"sucess"
                    }).status(200)
                    }else{
                        let senhaEncriptada = resultado[0]
                        let resposta =  bcrypt.compareSync(senha,senhaEncriptada)
                        if(resposta){
                            res.json({
                                msg : "Usuário autentificado",
                                status : "logado"
                            }).status(200)
                        }else{
                            res.json({
                                msg : "Erro na autenticação",
                                status : "Error"
                            }).status(400)
                        }
                    }

                }
            })
        }
    }
})



app.listen(port,(err)=>{
    if(err){
        console.log(err)
    }else{
        console.log("Servior rodando com sucesso!")
    }
})  
}
main()