import React, {Component} from 'react';

import {Table, Glyphicon} from 'react-bootstrap';

export default class SortableTable extends Component{
    
    constructor(props){
        super(props);
        
        this.state = {
            sort: props.defaultSortProperty,
            ascending: true
        }
        
        this.sort = this.sort.bind(this);
        this.renderColumHeader = this.renderColumnHeader.bind(this);
    }
    
    sort(property){
        const ascending = this.state.sort === property ? !this.state.ascending : true;
        this.setState({
            sort: property,
            ascending
        });
    }
    
    renderColumnHeader(property, label){
        const icon = property && property === this.state.sort ? this.state.ascending ? <Glyphicon glyph='chevron-down'/> : <Glyphicon glyph='chevron-up'/> : '';
        const onClick = property ? () => this.sort(property) : null;
        return (
            <th onClick={onClick}>{label} {icon}</th>        
        )
    }
    
    render(){
        const {headings, renderRow, data, sort} = this.props;
        
        const limit = this.props.limit || data.length;
        
        const sortProperty = this.state.sort;
        const sortDirection = this.state.ascending ? 1 : -1;
        
        sort ? sort(data, sortProperty, sortDirection) : data.sort((a, b) => {
            return (b[sortProperty] - a[sortProperty]) * sortDirection;
        });
        
        return (
            <Table striped hover>
                <thead>
                    <tr>
                        {headings.map(heading => this.renderColumnHeader(heading.property, heading.label))}
                    </tr>
                </thead>
                <tbody>
                    {data.slice(0, limit).map(x => renderRow(x))}
                </tbody>
            </Table>
        );
    }
    
}