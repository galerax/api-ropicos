const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const Core = require("./core");
new Core();

const User = require("./schema/user");

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get("/users", async (req, res) => {

    if (req.query.age) {
        const age = req.query.age;
        const user = await User.find().where("age").equals(age);
        return res.status(200).json({
            data: user,
        });
    } else {
        const user = await User.find();
        return res.status(200).json({
            data: user,
        });
    }


});


app.get("/users/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ "error": "Usuario não encontrado" });
    }
    return res.status(200).json({
        data: user
    });
});


app.get("/cells/:cell", async (req, res) => {
    const cell = await User.findOne({ cell: req.params.cell });
    if (!cell) {
        return res.status(404).json({ "error": "cell não encontrada" });
    }
    return res.status(200).json({
        data: cell
    });
});


app.post("/users", async (req, res) => {
    if ((await User.findById(req.body.id))) {
        return res.status(400).json({ error: "Id ja existe na base de dados" });
    };
    if (String(req.body.cell).length != 11) {
        return res.status(400).json({
            error: "cell.leght precisa ser = 11"
        });
    };
    const user = {
        name: req.body.name,
        cpf: req.body.cpf,
        age: req.body.age,
        cell: req.body.cell
    };
    await (new User(user).save());
    return res.status(200).json({ data: user });
});

app.patch("/users/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({
            error: "Usuario não encontrado"
        });
    }
    await user.updateOne(req.body);
    return res.status(200).json({ data: req.body });
});

app.delete("/users/:id", async (req, res) => {
    return res.status(200).json({
        data: (await User.findOneAndRemove({ _id: req.params.id }))
    });
});

app.listen(3000, () => {
    console.log("Server Started");
});