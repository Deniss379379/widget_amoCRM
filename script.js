define([], function () {
  var CustomWidget = function () {
    
/*
==========   получение контактов ======
*/
    const limit = 50;
    const allItems = 99; // значение является условным
    let pages = allItems/limit;
    const entity = 'contacts';
    let items = {};


    async function getContacts(page) {
                 try {
                    let response = await fetch(`/api/v4/${entity}?with=leads&order[id]=asc&limit=${limit}&page=${page}`,
                        {
                            method: 'GET',
                        });

                    if  (!!response) {
                        response = await response.json();
                        data = response._embedded.contacts;
                        Object.assign(items, data);
                        return data;
                    }
                    else {
                        console.log("Произошла ошибка во время получения контактов \n" + "Подробную информацию о коде ошибки можно посмотреть тут: https://www.amocrm.ru/developers/content/crm_platform/error-codes \n"  + "Код ошибки - " + response.status);
                      }
        
                } catch (error) {
                    console.log("Возникли технические неполадки, попробуйте пожалуйста позже или обратитесь в службу технической поддержки");
                }
        
                console.log(allItems)
        }

//использовал setTimeout для избежания блокировки аккаунта
    
    for (let index = 1; index <= pages; index++) {
        setTimeout(function run() {
            getContacts(index);
            setTimeout(run, 200);
          }, 200)
    }

/*
============================= создание и добавление задачи в контакты ==========================
*/

let task = [{ 
    "created_by": 0,
    "task_type_id": 1,
    "complete_till": 1652609444,
    "text": "Контакт без сделок",
    "entity_id": idContact,
    "entity_type": "contacts" }];

    async function createTasks(idContact) {

        let url = '/api/v4/tasks';

        let response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(task),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let data = await response.json();
        console.log('Задача создана', JSON.stringify(data));
};

/*
============================= нахождение контактов без сделок ==========================
*/

    let contactsWithoutLeads = []
    
    Object.keys(items).map(element => {
        if (element._embedded.leads.length === 0)
        contactsWithoutLeads.push(element)
    });


/*
============================= привязка задач к контактам ================================
*/
    
    for (let index = 0; index <= contactsWithoutLeads.length; index++) {
        setTimeout(function run() {
        createTasks(contactsWithoutLeads[index]);
        setTimeout(run, 200);
        }, 200)
    }

/*
=========================================================================================
*/
    this.callbacks = {
      render: function () {
        return true;
        },

        init: _.bind(function () {
        }, this),

        bind_actions: function () {
        },

        onSave: function () {
        alert('Спасибо за проверку тестового задания, буду благодарен за обратную связь');
        return true;
        },
    };
    return this;
  };

  return CustomWidget;
});