async function main() {

 //importando as libs que vou necessitar nesse projecto       
const express = require("express")
const validator = require("validator")
const mysql =  require("mysql")



const app = express()
app.use(express.json())

//connectando-se ao banco de dados mysql
let sql= ""
const connexion = await mysql.createConnection({
    host : "localhost",
    user : "root",
    database : "crudSystem",
    password : ""
})
await connexion.connect((err)=>{
    if(err){
      
        let error = new Error(err)
        console.log("Occoreu um erro ao tentar se connectar ao banco de dados", error.message)
        throw new Error(err)
    }else{
        console.log("Connectado com ao bacnco de dados  sucesso!")
    }
})

//desativando o cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    // authorized headers for preflight requests
    // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
    app.options('*', (req, res) => {
    // allowed XHR methods
    res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
    res.send();
    });
    });


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
app.get("/user/:email",(req , res)=>{

    let email  = req.params.email
        if(!email){
            res.json({msg : "Envie os dados , preenchidos"}).status(422)
        }
        else{
            sql = `select * from users where email = "${email}";`
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
            if(validator.isEmail(email)){
                sql = `select * from users where email = "${email}";`
                connexion.query(sql,(err,result)=>{
                    if(err){
                        res.json({msg : Error(err).message}).status(400)
                    }else{
                        if(result.length === 0){
                            sql = `insert into users(nome,nacionalidade,email,tel,profissao) value("${nome}","${nacionalidade}","${email}","${tel}","${profissao}");`
                            connexion.query(sql,(error,resultado)=>{
                                if(error){
                                    res.json({msg : Error(error).message}).status(400)
                                }else{
                                    res.json({msg : "Usuário cadastrado com sucesso"}).status(200)
                                    console.table(req.body)
                                }
                            })
                        }else{
                            res.json({msg : "Email ja foi utilizado!, tente novamente com outro email"})
                        }
                    }
                })
            }else{
                res.json({msg: "email incorrecto, \n ex: client@gmail.com"})
            }
           
          
        }
})

//rota para eliminar um usuário
app.delete("/user/:id",(req , res)=>{
    let id = req.params.id
        if(!id){
            res.json({msg : "Envie os dados , preenchidos"}).status(422)
        }else{
                sql = `select * from users where id = "${id}";`
                connexion.query(sql,(err, result)=>{
                        if(err){
                            res.json({msg : err}).status(400)
                      }
                      else{
                            if(result.length === 0){
                                res.json({msg : "Usuário não encotrado"}).status(422)
                           }
                            else{
                                sql = `delete from users where id = "${id}";`
                                connexion.query(sql,(err)=>{
                                    if(err){
                                        res.json({msg : Error(err).message}).status(400)
                                    }else{
                                        res.json({msg : "Usuário eliminado com sucesso!"}).status(200)
                                    }
                                })
                        }
                    }
                })

        }
})

app.listen(3030,(err)=>{
    
    if(err){
        throw new Error(err)
    }else{
       
        console.log("Servidor esta rodando na porta 3030")
    }
    
})
    
}
main()