const express = require('express');
const router = express.Router();
const user = require('./user');
const bcrypt = require('bcryptjs');



router.get('/admin/users',(req,res)=>{
    user.findAll().then(users=>{
        res.render('admin/users/index',{users})
    })
});

router.get('/admin/users/create',(req,res)=>{
    res.render('admin/users/create')
});

router.post('/users/create',(req,res)=>{
    const {email,password} = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password,salt);

    user.findOne({where:{email:email}}).then(users=>{
        if(users == undefined){
            user.create({
                email,
                password:hash
            }).then(()=>{
                res.redirect('/');
            }).catch((err)=>{
                res.redirect('/')
            })
            res.redirect('/admin/users/create');
        }else{
            res.redirect('/admin/users/create');
        }
    })

    
    
})


router.get('/login',(req,res)=>{
    res.render('admin/users/login')
});
router.post('/authenticate',(req,res)=>{
    const {email,password} = req.body;

    user.findOne({where:{email:email}}).then(users=>{
        if(users!=undefined){
            //validar senha
            const correct = bcrypt.compareSync(password,users.password);

            if(correct){
                req.session.user = {id:users.id,email:users.email}
                res.json(req.session.user)
            }else{
                res.redirect('/login')
            }
        }else{
            res.redirect('/login')
        }
    })
})

module.exports = router;