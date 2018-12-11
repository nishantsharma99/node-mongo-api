const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');

const User = db.User;

module.exports = {
    authenticate,
    getAll,
    //getById,
    create,
    update,
    update2,
    forgot,
    upload1
    //delete: _delete
};

async function authenticate({ username, password }) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, config.secret);
        return {
            ...userWithoutHash,
            token
        };
    }
}

async function getAll() {
    return await User.find().select('-hash');
}//

async function getById(id) {
    return await User.findById(id).select('-hash');
}//

async function create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}
async function update2(userParam) {
    const user = await User.findOne({ username: userParam.username });

    // validate
    if (!user) throw 'User not found';


    // hash password if it was entered
    // if (userParam.password) {
    //     userParam.hash = bcrypt.hashSync(userParam.password, 10);
    // }
        if(bcrypt.compareSync(userParam.oldpassword, user.hash)){
            userParam.hash = bcrypt.hashSync(userParam.newpassword, 10);
        }
   

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

// async function _delete(id) {
//     await User.findByIdAndRemove(id);
// }//
async function forgot(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    // // if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
    //     throw 'Username "' + userParam.username + '" is already taken';
    // }

    // hash password if it was entered
    // if (userParam.password) {
    //     userParam.hash = bcrypt.hashSync(userParam.password, 10);
    // }

    // copy userParam properties to user
    // Object.assign(user, userParam);

    // await user.save();
    console.log("User forgot his password");
}
async function upload1(userParam) {
    const user = await User.findOne({ username: userParam.body.username });
    user.img.unshift(userParam.file.path);
    await user.save();
    console.log("uploaded an image");
}