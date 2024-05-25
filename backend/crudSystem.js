//importando as libs que vou necessitar nesse projecto

const express = require("express")
const validator = require("validator")
const mysql =  require("mysql")



const app = express()
app.use(express.json())

//connectando-se ao banco de dados
let sql= ""
const connexion = mysql.createConnection({
    host : "localhost",
    user : "root",
    database : "crudSystem",
    password : ""
})
connexion.connect((err)=>{
    if(err){
        throw new Error(err)
    }else{
        console.log("Connectado com ao bacnco de dados  sucesso!")
    }
})


//rota inicial da app
app.get("/",(req , res)=>{
    res.send("Bem vindo a API da crudSystem").status(200)
})

//rota de listagem de usuarios
app.get("/Allusers",(req , res)=>{
    sql = "select * from users;"
   
        connexion.query(sql,(err, result)=>{
            if(err){
                res.json({msg : err}).status(400)
            }else{
                res.json(result).status(200)
            }
        })
    }
)

//rota para pegar um usuário pelo telefone e email
app.get("/user/:email/:tel",(req , res)=>{

    let {email , tel} = req.params
        if(!email || !tel){
            res.json({msg : "Envie os dados , preenchidos"}).status(422)
        }
        else{
            sql = `select * from users where email = "${email}" and tel = "${tel}";`
            connexion.query(sql,(err, result)=>{
                if(err){
                    res.json({msg : err}).status(400)
                }else{
                    if(result.length === 0){
                        res.json({msg : "Usuário não encotrado"}).status(400)
                    }else{
                        res.json(result).status(200)
                    }
                }
            })
        } 
})


//rota para cadastrar um usuário
app.post("/users",(req , res)=>{

    const{nome , nacionalidade ,email , tel , profissao} = req.body 
    if(!req.body){
        res.json({msg : "Envia os dados"}).status(422)
    }else{
        if(!nome){
            res.json({msg : "Nome em falta"}).status(422)
        }
        else if(!nacionalidade){
            res.json({msg : "Nacionalidade em falta"}).status(422)
        }
        else if(!email){
            res.json({msg : "Email em falta"}).status(422)
        }
        else if(!tel){
            res.json({msg : "Telefone em falta"}).status(422)
        }
        else if(!profissao){
            res.json({msg : "Profissão em falta"}).status(422)
        }else{

            sql = `select * from users where email = "${email}" and tel = "${tel}";`
            connexion.query(sql,(err, result)=>{
                if(err){
                    res.json({msg : err})
                }else{
                    if(result.length === 0){
                        sql = `insert into users (nome, nacionalidade , email , tel , profissao) value ("${nome}", "${nacionalidade}" , "${email}","${tel}","${profissao}");`
                        if(validator.isEmail(email)){
                            connexion.query(sql,(err, result)=>{
                                if(err){
                                    res.json({msg : err})
                                }else{
                                    res.json({msg : "cadastrado com sucesso!"}).status(200)
                                    console.log("cadastrado com sucesso!")
                                }
                            })
                        }else{
                            res.json({msg : "Email ou a senha não seguem o padrão"}).status(422)
                        }
                      
                    }else{
                        res.json({msg : "O Email ou o telefone ja  foram utilizado, tente novamente com novos dados"}).status(422)
                    }
                   
                }
            })

          
        }
      
    }
})


app.listen(3030,(err)=>{
    
    if(err){
        throw new Error(err)
    }else{
       
        console.log("Servidor esta rodando na porta 3030")
    }
    
})