<template>
    <div class="hello">
        <h2>2. 電話番号を登録</h2>
        <p>
            ふにっとコミュニティサーバーでは, 電話番号を利用したSMS認証を行っています.<br/>
            SMS認証導入の目的は同一人物による複数アカウントを作成を防止するために導入しています. <br/>
            (同一人物による複数アカウントを用いた荒らしが多発しているため, これを防止する目的です)<br/>
            ここで入力された電話番号はこの目的以外に利用されることはありません.
        </p>
        <div id="firebaseui-auth-container"></div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import * as firebase from 'firebase';
    import * as firebaseui from 'firebaseui';
    // tslint:disable-next-line
    require('firebaseui/dist/firebaseui.css');

    @Component
    export default class Authentification extends Vue {
        @Prop() private onSignInSuccess!: (authResult: any, redirectUrl: any) => boolean;

        private deleteFirebaseUI?: () => void;

        private mounted() {
            const uiConfig = {
                // ログイン完了時のリダイレクト先
                signInSuccessUrl: '/connect_discord',

                // 利用する認証機能
                signInOptions: [{
                    provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                    defaultCountry: 'JP',
                }],

                // 利用規約のURL(任意で設定)
                tosUrl: 'https://fnit.dev',
                // プライバシーポリシーのURL(任意で設定)
                privacyPolicyUrl: 'https://fnit.dev',
                callbacks: {
                    signInSuccessWithAuthResult: this.onSignInSuccess,
                },
            };

            const ui = new firebaseui.auth.AuthUI(firebase.auth());
            ui.start('#firebaseui-auth-container', uiConfig);
            this.deleteFirebaseUI = () => {
                ui.delete();
            };
        }

        private beforeDestroy() {
            if (this.deleteFirebaseUI) {
                this.deleteFirebaseUI();
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    h3 {
        margin: 40px 0 0;
    }
    ul {
        list-style-type: none;
        padding: 0;
    }
    li {
        display: inline-block;
        margin: 0 10px;
    }
    a {
        color: #42b983;
    }
</style>
