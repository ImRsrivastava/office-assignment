const Connection = require('./Components/DatabaseConnect');
const express = require("express");
const {body, check, validationResult} = require("express-validator");
const Router = express.Router();
const Miscellaneous = require('./Components/Miscellaneous');
const Jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const fs = require('fs');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folderPath = './uploads';
        if (!fs.existsSync(folderPath)) { fs.mkdirSync(folderPath); }
        cb(null, folderPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// USER ROUTE's CALLING 
Router.post('/api/login', [
    body('email').notEmpty().withMessage('* Email should be required.'),
    body('password').notEmpty().withMessage('* Password should be required.')
], async (req, res) => {
    const validateErr = validationResult(req);
    if(!validateErr.isEmpty()) {
        const errors = validateErr.array().reduce((acc, err) => {
            acc[err.path] = err.msg;
            return acc;
        }, {});     
        return res.status(422).json({ errors: errors }); }
    else {
        let data = req.body;
        Connection.query("SELECT * FROM `auths` WHERE `email` = ? AND `role` = ?", [data.email, 2], async (errs, rows) => {
            
            if(errs) { return res.status(500).json({msg: '* '+errs.sqlMessage}); }
            if(rows.length == 0) { return res.status(500).json({msg: '* Unauthorized User. Try again'}); }

            let user = rows[0];
            let passCom = await Miscellaneous.bcryptPasswordCompare(data.password, user.password); // WILL RETURN TRUE OR FALSE
            if(passCom) {
                const token = Jwt.sign({user}, Miscellaneous.JwtSecretKey, {expiresIn: '1h'});
                return res.status(200).json({'token':token, 'user':user, 'msg':'Logged in successfully.'});  }

            if(!passCom) {
                return res.status(401).json({msg: '* Invalid Credentials, Try again.'}); }
        });
    }
});

Router.post('/api/signup', [
    body('name').notEmpty().withMessage('* Name should be required.'),
    body('email').notEmpty().withMessage('* Email should be required.'),
    body('password').notEmpty().withMessage('* Password should be required.'),
    body('confirmPassword').notEmpty().withMessage('* Confirm Password should be required.'),
    body('contact').notEmpty().withMessage('* Phone Number should be required.'),
],  async (req, res) => {
    const validateErr = validationResult(req);
    if(!validateErr.isEmpty()) {
        const errors = validateErr.array().reduce((acc, err) => {
            acc[err.path] = err.msg;
            return acc;
        }, {});     
        return res.status(422).json({ errors: errors }); }
    else {
        let data = req.body;
        if(data.password === data.confirmPassword) {
            Connection.query("SELECT * FROM `auths` WHERE `email` = ?", [data.email], async (errs, rows) => {
                
                if(errs) { return res.status(500).json({msg: '* '+errs.sqlMessage}); }
                if(rows.length > 0) { return res.status(500).json({msg: "* Email is already in use, Signup with other email."}); }

                if(rows.length <= 0) {
                    let bcryptPassword = await Miscellaneous.bcryptPassword(data.password);

                    Connection.query("INSERT INTO `auths` (`name`,`email`,`password`,`contact`,`role`,`created_at`,`updated_at`) VALUES (?,?,?,?,?,?,?)", [data.name, data.email, bcryptPassword, data.contact, 2, new Date(), new Date()], (erri, rowi) => {
                        
                        if(erri) { return res.status(500).json({msg: '* '+erri.sqlMessage});  }
                        if(rowi) { return res.status(200).json({msg: "* User account created successfully."});   }
                    });
                }
            });
        }
        else { return res.status(500).json({msg: '* Password and Confirm Password should be same.'});   }
    }
});

Router.get('/api/auth', Miscellaneous.jsonTokenVerify, (req, res) => {
    const {user} = req.user
    return res.json(user);
});

Router.get('/api/category', (req, res) => {
    try {
        Connection.query("SELECT `id`,`category_name` FROM `categories` ORDER BY `id` DESC", (errs, rows) => {
            if(errs) { res.status(500).json({msg: '* '+errs.sqlMessage}); }
            if(rows) { res.status(200).json(rows); }
        });
    }
    catch(error) {
        res.status(500).json({msg: '* '+error});
    };
});

Router.post('/api/upload-image', Miscellaneous.jsonTokenVerify, upload.single('image'), (req, res) => {
    try {
        console.log('chck-image:: ',req.file);
        const validateErr = validationResult(req);
        if(!validateErr.isEmpty()) {
            const errors = validateErr.array().reduce((acc, err) => {
                acc[err.path] = err.msg;
                return acc;
            }, {});     
            return res.status(422).json({ errors: errors }); 
        }
        else {
            // const image = req.file.filename;
            const image = req.body.image;
            const data = req.body;
            // Connection.query("INSERT INTO `images` (`user_id`, `category_id`, `image`, `keywords`, `created_at`, `updated_at`) VALUES (?,?,?,?,?,?)", [data.userId, data.category, image, data.keywords, new Date(), new Date()], (errs, rows) => {
            //     if(errs) { return res.status(500).json({msg: '* '+errs.sqlMessage}); }
            //     if(rows) { return res.status(200).json({msg: '* Image uploaded successfully.'}); }
            // });
        }
    }
    catch (er) {
        res.status(500).json({msg: '* '+er});
    }
});

Router.get('/api/image/list', (req, res) => {
    try {
        Connection.query('SELECT `images`.`user_id`, `images`.`category_id`, `images`.`image`, `images`.`keywords` FROM `images` ORDER BY `id` DESC', (errs, rows) => {
            
            if(errs) { return res.status(500).json({msg: '* '+errs.sqlMessage}); }
            if(rows.length == 0) { return res.status(200).json({msg: '* No uploaded found.'}); }
            if(rows.length > 0) { return res.status(200).json(rows); }
        });
    }
    catch (er) {
        res.status(500).json({msg: '* '+er});
    }
});

Router.post('/api/image/search/', (req, res) => {
    try {
        const data = req.body;
        
        if((data.search.length > 0) && (data.cateId > 0)) {
            Connection.query("SELECT `images`.`user_id`, `images`.`category_id`, `images`.`image`, `images`.`keywords` FROM `images` WHERE `category_id` = ? AND `keywords` LIKE ?", [data.cateId, '%'+data.search+'%'], (errs, rows) => {
                if(errs) { return res.status(500).json({msg: '* '+errs.sqlMessage}); }
                if(rows.length == 0) { return res.status(200).json({msg: '* No uploaded found.'}); }
                if(rows.length > 0) { return res.status(200).json(rows); }
            });
        }
        if((data.search.length <= 0) && (data.cateId > 0)) {
            Connection.query("SELECT `images`.`user_id`, `images`.`category_id`, `images`.`image`, `images`.`keywords` FROM `images` WHERE `category_id` = ?", [data.cateId], (errs, rows) => {
                if(errs) { return res.status(500).json({msg: '* '+errs.sqlMessage}); }
                if(rows.length == 0) { return res.status(200).json({msg: '* No uploaded found.'}); }
                if(rows.length > 0) { return res.status(200).json(rows); }
            });
        }
        if((data.search.length > 0) && (data.cateId <= 0)) {
            Connection.query("SELECT `images`.`user_id`, `images`.`category_id`, `images`.`image`, `images`.`keywords` FROM `images` WHERE `keywords` LIKE ?", ['%'+data.search+'%'], (errs, rows) => {
                if(errs) { return res.status(500).json({msg: '* '+errs.sqlMessage}); }
                if(rows.length == 0) { return res.status(200).json({msg: '* No uploaded found.'}); }
                if(rows.length > 0) { return res.status(200).json(rows); }
            });
        }
    }
    catch (er) {
        res.status(500).json({msg: '* '+er});
    }
});

Router.get('/api/upload-image/list', Miscellaneous.jsonTokenVerify, (req, res) => {
    try {
        const {user} = req.user;
        Connection.query('SELECT `images`.`user_id`, `images`.`category_id`, `images`.`image`, `images`.`keywords`, `categories`.`category_name` FROM `images` INNER JOIN `categories` ON images.category_id = categories.id WHERE `user_id` = ?', [user.id], (errs, rows) => {
            
            if(errs) { return res.status(500).json({msg: '* '+errs.sqlMessage}); }
            if(rows.length == 0) { return res.status(200).json({msg: '* No uploaded found.'}); }
            if(rows.length > 0) { return res.status(200).json(rows); }
        });
    }
    catch (er) {
        res.status(500).json({msg: '* '+er});
    }
})




// ADMIN ROUTE's CALLING 
Router.post('/api/admin/login', [
    body('email').notEmpty().withMessage('* Email should be required.'),
    body('password').notEmpty().withMessage('* Password should be required.')
], async (req, res) => {
    const validateErr = validationResult(req);
    if(!validateErr.isEmpty()) {
        const errors = validateErr.array().reduce((acc, err) => {
            acc[err.path] = err.msg;
            return acc;
        }, {});     
        return res.status(422).json({ errors: errors }); }
    else {
        let data = req.body;
        Connection.query("SELECT * FROM `auths` WHERE `email` = ? AND `role` = ?", [data.email, 1], async (errs, rows) => {
            
            if(errs) { return res.status(500).json({msg: '* '+errs.sqlMessage}); }
            if(rows.length == 0) { return res.status(500).json({msg: '* Unauthorized User. Try again'}); }

            let user = rows[0];
            let passCom = await Miscellaneous.bcryptPasswordCompare(data.password, user.password); // WILL RETURN TRUE OR FALSE
            if(passCom) {
                const token = Jwt.sign({user}, Miscellaneous.JwtSecretKey, {expiresIn: '1h'});
                return res.status(200).json({'token':token, 'user':user, 'msg':'Logged in successfully.'});  }

            if(!passCom) {
                return res.status(401).json({msg: '* Invalid Credentials, Try again.'}); }
        });
    }
});

Router.get('/api/admin/auth', Miscellaneous.jsonTokenVerify, (req, res) => {
    const {user} = req.user
    return res.json(user);
});

Router.get('/api/admin/category', Miscellaneous.jsonTokenVerify, (req, res) => {
    try {
        Connection.query("SELECT * FROM `categories` ORDER BY `id` DESC", (errs, rows) => {
            if(errs) { res.status(500).json({msg: '* '+errs.sqlMessage}); }
            if(rows) { res.status(200).json(rows); }
        });
    }
    catch(error) {
        res.status(500).json({msg: '* '+error});
    };
});

Router.post('/api/admin/category/create', [ body('cateName').notEmpty().withMessage('* Category name should be required.')], Miscellaneous.jsonTokenVerify, (req, res) => {
    try {
        const validateErr = validationResult(req);
        if(!validateErr.isEmpty()) {
            const errors = validateErr.array().reduce((acc, err) => {
                acc[err.path] = err.msg;
                return acc;
            }, {});     
            return res.status(422).json({ errors: errors }); 
        }
        else {
            let cateName = req.body.cateName;
            Connection.query("SELECT * FROM `categories` WHERE `category_name` = ?", [cateName], async (errs, rows) => {                
                if(errs) { return res.status(500).json({msg: '* '+errs.sqlMessage}); }
                if(rows.length > 0) { return res.status(500).json({msg: "* Duplicate Category not allowed."}); }

                if(rows.length <= 0) {
                    Connection.query("INSERT INTO `categories` (`category_name`,`created_at`,`updated_at`) VALUES (?,?,?)", [cateName, new Date(), new Date()], (erri, rowi) => {
                        if(erri) { return res.status(500).json({msg: '* '+erri.sqlMessage});  }
                        if(rowi) { return res.status(200).json({msg: "* Category created successfully."});   }
                    });
                }
            });
        }
    }
    catch(error) {
        res.status(500).json({msg: '* '+error});
    };
});

Router.delete('/api/admin/category/:id', Miscellaneous.jsonTokenVerify, (req, res) => {
    try {
        const cateId = Buffer.from(Buffer.from(req.params.id, 'base64').toString(), 'base64').toString();
        Connection.query("SELECT * FROM `categories` WHERE `id` = ?", [cateId], (errs, rows) => {
            
            if(errs) { return res.status(500).json({msg: '* '+errs.sqlMessage});   }
            if(rows.length == 0) { return res.status(500).json({msg: '* No appropriate record found, Try again.'});  }
            
            if(rows.length > 0) {
                Connection.query("DELETE FROM `categories` WHERE `id` = ?", [cateId], (dErrs, dRows) => {
                    if(dErrs) { return res.status(500).json({msg: '* '+dErrs.sqlMessage});  }
                    if(dRows) { return res.status(200).json({msg: '* Category deleted successfully.'});  }
                });
            }
        });
    }
    catch(error) {
        res.status(500).json({msg: '* '+error});
    };
});

Router.get('/api/admin/category/:id', Miscellaneous.jsonTokenVerify, (req, res) => {
    try {
        const cateId = Buffer.from(Buffer.from(req.params.id, 'base64').toString(), 'base64').toString();
        Connection.query("SELECT * FROM `categories` WHERE `id` = ?", [cateId], (errs, rows) => {
            
            if(errs) { return res.status(500).json({msg: '* '+errs.sqlMessage});   }
            if(rows.length == 0) { return res.status(500).json({msg: '* No appropriate record found, Try again.'});  }
            
            if(rows.length > 0) { return res.status(200).json(rows);  }
        });
    }
    catch(error) {
        res.status(500).json({msg: '* '+error});
    };
});

Router.put('/api/admin/category/update', [ body('cateName').notEmpty().withMessage('* Category name should be required.')], Miscellaneous.jsonTokenVerify, (req, res) => {
    try {
        const validateErr = validationResult(req);
        if(!validateErr.isEmpty()) {
            const errors = validateErr.array().reduce((acc, err) => {
                acc[err.path] = err.msg;
                return acc;
            }, {});     
            return res.status(422).json({ errors: errors }); 
        }
        else {
            const cateId = req.body.cateId;
            const cateName = req.body.cateName;
            Connection.query("SELECT * FROM `categories` WHERE `category_name` = ? AND `id` != ?", [cateName, cateId], async (errs, rows) => {                
                if(errs) { return res.status(500).json({msg: '* '+errs.sqlMessage}); }
                if(rows.length > 0) { return res.status(500).json({msg: "* Duplicate Category not allowed."}); }

                if(rows.length <= 0) {
                    Connection.query("UPDATE `categories` SET `category_name` = ?, `updated_at` = ? WHERE `id` = ?", [cateName, new Date(), cateId], (erri, rowi) => {
                        if(erri) { return res.status(500).json({msg: '* '+erri.sqlMessage});  }
                        if(rowi) { return res.status(200).json({msg: "* Category updated successfully."});   }
                    });
                }
            });
        }
    }
    catch(error) {
        res.status(500).json({msg: '* '+error});
    };
});

Router.get('/api/admin/users', Miscellaneous.jsonTokenVerify, (req, res) => {
    try {
        Connection.query("SELECT * FROM `auths` WHERE `role` = 2 ORDER BY `id` DESC", (errs, rows) => {
            if(errs) { res.status(500).json({msg: '* '+errs.sqlMessage}); }
            if(rows) { res.status(200).json(rows); }
        });
    }
    catch(error) {
        res.status(500).json({msg: '* '+error});
    };
});



module.exports = Router;