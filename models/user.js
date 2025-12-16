const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');//passport-local-mongoose@6を使用(mongoose@5のため)

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

userSchema.plugin(passportLocalMongoose, {
    errorMessages: {
        UserExistsError: 'そのユーザー名はすでに使われています',
        MissingPasswordError: 'パスワードは与えられていません',
        AttemptTooSoonError: 'アカウントは現在ロックされています。後でもう一度試してみて',
        TooManyAttemptsError: 'ログイン失敗が多すぎてアカウントがロックされました',
        NoSaltValueStoredError: '認証は不可能です。塩分の価値は保存されません',
        IncorrectPasswordError: 'パスワードまたはユーザー名が誤りです',
        IncorrectUsernameError: 'パスワードまたはユーザー名が誤りです',
        MissingUsernameError: 'ユーザー名は公開されていません',
    }
});

module.exports = mongoose.model('User', userSchema);