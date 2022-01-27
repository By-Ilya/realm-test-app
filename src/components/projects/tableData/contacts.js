export default function generateContactsTableData(project) {
    if (!project) {
        return {
            contactsTableColumns: [],
            contactsTableRows: [],
        };
    }

    const { contacts_list, primary_customer_contact } = project;

    const contactsTableColumns = [
        { title: 'Type', field: 'type', editable: 'never' },
        { title: 'Name', field: 'name', editable: 'always' },
        { title: 'Email', field: 'email', editable: 'always' },
    ];

    const contactsTableRows = [];

    var primary_contact_override_present = false;
    if (contacts_list && contacts_list.length > 0)
        contacts_list.forEach(el => {
            contactsTableRows.push({
                ...el,
                editable: true
            })
            if (el.type === 'Customer (Primary)')
                primary_contact_override_present = true
        })


    if (!primary_contact_override_present && primary_customer_contact) {
        contactsTableRows.unshift({
            type: 'Customer (Primary)',
            name: primary_customer_contact.name,
            email: primary_customer_contact.email,
            editable: true
        })
    }

    return { contactsTableColumns, contactsTableRows };
}
