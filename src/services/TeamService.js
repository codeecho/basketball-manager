export default class TeamService{
    
    calculatePayroll(players){
        let payroll = 0;
        players.forEach(player => payroll += player.salary);
        return payroll;
    }
    
}