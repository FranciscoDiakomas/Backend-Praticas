const bcrypt = require('bcrypt')

const senha = "123"
async function senHa() {
    let original = senha
    let encript = await bcrypt.hash(senha,10)
    let res = await bcrypt.compare(original , encript)
    console.log(encript)
    console.log(original)
    console.log(res)
    
}
senHa()