const Modal = {
    // Desafio: substituir essa função por uma função toogle
    open() {
      // Abrir o painel de novas transações
      // Adicionar a classe "active" do modal-overlay
      document.querySelector('.modal-overlay')
              .classList
              .add('active')
    },
  
    close() {
      // Fechar o painel de novas transações
      // Remover a classe "active" do modal-overlay
      document.querySelector('.modal-overlay')
              .classList
              .remove('active')
    }
  }
  
  const Storage = {
    get(){
      return JSON.parse(localStorage.getItem("con.financeiro:transactions")) || []
    },
  
    set(transactions){
      localStorage.setItem("con.financeiro:transactions", JSON.stringify(transactions))
    }
  }
  
  const Transaction = {
    // Refatorando as transações para melhorar no futuro
    all: Storage.get(),
  
    // Manipulando inserção e remoção das transações
    add(transaction){
      Transaction.all.push(transaction)
  
      console.log(Transaction.all)
    },
  
    remove(index){
      Transaction.all.splice(index, 1)
  
      App.reload()
    },
    
    // Funções do balanço
    incomes(){
      // Somar as entradas
      let income = 0
      Transaction.all.forEach((transaction) => {
        if(transaction.amount > 0){
          income += transaction.amount
        }
      })
      return income
    },
  
    expenses(){
      // Somar as entradas
      let expense = 0
      Transaction.all.forEach((transaction) => {
        if(transaction.amount < 0){
          expense += transaction.amount
        }
      })
      return expense
    },
  
    total(){
      // Entradas - Saídas
      return Transaction.incomes() + Transaction.expenses()
    }
  }
  
  const DOM = {
    // Manipulação do HTML
    // Espaço onde ficam as transações separadas
    transactionsContainer: document.querySelector("#data-table tbody"),
    
    addTransaction(transaction,index){
      // Adicionar a transação ao HTML
      
      // Cria uma variável tr (linha) no HTML
      const tr = document.createElement("tr")
      
      // Dá um valor à variável
      tr.innerHTML = DOM.innerHTMLTransaction(transaction,index)
      
      // Associa o index do elemento no banco de dados ao elemento HTML
      tr.dataset.index = index
      // Adicionando ao HTML
      DOM.transactionsContainer.appendChild(tr)
    },
  
    innerHTMLTransaction(transaction, index){
      // Definindo a classe da transação (expense ou income)
      const CSSClasses = transaction.amount > 0 ? "income" : "expense"
  
      // Formatação da moeda
    //   const amount = utils.formatCurrency(transaction.amount)
      // Cria a estrutura HTML
      const html = 
      // Recebe os valores (description, amount, date)
      `
        <td class="description">${transaction.Filtro}</td>
        <td class="description">${transaction.Peso}</td>
        <td class="description">${transaction.Umidade}</td>
        <td class="description">${transaction.Ciclo}</td>
        <td class="description">${transaction.resultado}</td>
        <td>
          <a href = "#" onclick = "Transaction.remove(${index})" alt="Remover Transação" >Remover</a>
        </td>
      `
  
      return html
    },
  
    updateBalance() {
      // Aqui ele está formatando e adicionando os valores ao espaço "balance"
        document
                .getElementById("incomeDisplay") // Ele chama a função formatCurrency do objeto utils
                .innerHTML = utils.formatCurrency(Transaction.incomes())
        document
                .getElementById("expenseDisplay")
                .innerHTML = utils.formatCurrency(Transaction.expenses())
        document
                .getElementById("totalDisplay")
                .innerHTML = utils.formatCurrency(Transaction.total())
    },
  
    clearTransactions(){
      // Ele zera as transações mostradas para que não haja nenhuma repetida
      DOM.transactionsContainer.innerHTML = ""
    }
  
  }
  
  const utils = {
    formatCurrency(value){
      const signal = Number(value) < 0 ? "-" : ""
      
      value = String(value).replace(/\D/g, "")
  
      value = Number(value) / 100
  
      return value
    },
  
    formatAmount(value){
      value = Number(value)
      return value
    },
  
    formatDate(value){
      const splittedDate = value.split("-")
      return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    }
  }
  
  const Form = {
    // Manipulação do formulário de inserção
    // Declarando os inputs para a manipulação
    Filtro: document.getElementById("Filtro"),
    Peso: document.getElementById("Peso"),
    Umidade: document.getElementById("Umidade"),
    Ciclo: document.getElementById("Ciclo"),
  
    getValues(){
      return{
        Filtro: Form.Filtro.value,
        Peso: Form.Peso.value,
        Umidade: Form.Umidade.value,
        Ciclo: Form.Ciclo.value
      }
    },
  
    validateFields(){
      const {Filtro, Peso, Umidade, Ciclo} = Form.getValues()
      // Validação dos inputs
      if(Filtro.trim() === "" || Peso.trim() === "" || Umidade.trim() === "" || Ciclo.trim() === ""){
        throw new Error("Por favor, preencha todos os campos") 
      }
    },
  
    FormatValues(){
      // Formatação dos dados inseridos
      let {Filtro, Peso, Umidade, Ciclo} = Form.getValues()
      
      Filtro = utils.formatAmount(Filtro)
      
      Peso = utils.formatAmount(Peso)
      
      Umidade = utils.formatAmount(Umidade)
      
      Ciclo = utils.formatAmount(Ciclo)
  
      console.log("Formatação dos dados")
      
      // let resultado = ((((description/1000)*(100-amount)/100)*120)/date)*3600
      let resultado = ((((Peso/1000)*(100-Umidade)/100)*120)/Ciclo)*3600
      resultado = (resultado).toFixed(2)
      console.log(resultado)
      return{
        Filtro, 
        Peso, 
        Umidade, 
        Ciclo,
        resultado
      }
    },
  
    saveTransaction(transaction){
      Transaction.add(transaction)
    },
  
    clearFields(){
      Form.Filtro.value = ""
      Form.Peso.value = ""
      Form.Umidade.value = ""
      Form.Ciclo.value = ""
    },
  
    submit(event){
      event.preventDefault()
  
      try {
        // Valida os campos
        Form.validateFields()
        // Formata os dados inseridos
        const transaction = Form.FormatValues()
        // Salva as transações uma a uma
        Form.saveTransaction(transaction)
        // Limpa os campos do formulário para uma nova transação
        Form.clearFields()
        // Fecha o modal
        Modal.close() 
        // Recarrega a aplicação
        App.reload()
      } catch (error) {
        alert(error.message)
      }
  
    }
  }
  
  const App = {
    init(){
      Transaction.all.forEach(DOM.addTransaction)
  
    //   DOM.updateBalance()
  
      Storage.set(Transaction.all)
    },
  
    reload(){
      DOM.clearTransactions()
      App.init()
    }
  }
  
  App.init()
  Storage.get()
  
