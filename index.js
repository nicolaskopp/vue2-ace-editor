var ace = require('brace');

module.exports = {
    render: function (h) {
        var height = this.height ? this.px(this.height) : '100%'
        var width = this.width ? this.px(this.width) : '100%'
        return h('div',{
            attrs: {
                style: "height: " + height  + '; width: ' + width,
            }
        })
    },
    props:{
        value:String,
        height:true,
        width:true,
        options:Object,
        useEmmet:false,
    },
    data: function () {
        return {
            editor:null,
            contentBackup:""
        }
    },
    methods: {
        px:function (n) {
            if( /^\d*$/.test(n) ){
                return n+"px";
            }
            return n;
        }
    },
    watch:{
        value:function (val) {
            if(this.contentBackup !== val){
                this.editor.session.setValue(val,1);
                this.contentBackup = val;
            }
        },
        options:function(newOption){
            this.editor.setOptions(newOption);
        },
        height:function(){
            this.$nextTick(function(){
                this.editor.resize()
            })
        },
        width:function(){
            this.$nextTick(function(){
                this.editor.resize()
            })
        }
    },
    beforeDestroy: function() {
        this.editor.destroy();
        this.editor.container.remove();
    },
    mounted: function () {
        var vm = this;

        if(this.useEmmet) require('brace/ext/emmet');

        var editor = vm.editor = ace.edit(this.$el);
        editor.$blockScrolling = Infinity;

        this.$emit('init',editor);
        
        if(this.useEmmet) editor.setOption("enableEmmet", true);
        if(this.value)
            editor.setValue(this.value,1);
        this.contentBackup = this.value;

        editor.on('change',function () {
            var content = editor.getValue();
            vm.$emit('input',content);
            vm.contentBackup = content;
        });
        if(vm.options)
            editor.setOptions(vm.options);
    }
}
