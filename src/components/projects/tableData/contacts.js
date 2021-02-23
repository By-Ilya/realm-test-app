export default function generateContactsTableData(project) {
    if (!project) {
        return {
            contactsTableColumns: [],
            contactsTableRows: [],
        };
    }

    const { contacts } = project;

    const contactsTableColumns = [
        { title: 'Type', field: 'type', editable: 'never' },
        { title: 'Name', field: 'name', editable: 'onUpdate' },
        { title: 'Email', field: 'email', editable: 'onUpdate' },
    ];
    const contactsTableRows = [
        {
            type: 'Customer',
            name: (contacts && contacts.customer) ? contacts.customer.name : '',
            email: (contacts && contacts.customer) ? contacts.customer.email : '',
            editable: true,
            updateKey: 'contacts.customer',
        },
        {
            type: 'Consulting Engineer',
            name: (contacts && contacts.ce) ? contacts.ce.name : '',
            email: (contacts && contacts.ce) ? contacts.ce.email : '',
            editable: true,
            updateKey: 'contacts.ce',
        },
    ];

    return { contactsTableColumns, contactsTableRows };
}
