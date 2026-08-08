(function process( /*RESTAPIRequest*/ request,
    /*RESTAPIResponse*/
    response) {
    try {
        var number = request.pathParams.number;

        if (!number) {
            response.setStatus(400);
            response.setBody({
                status: 'error',
                message: 'Incident number is required in path'
            });
            return;
        }

        var gr = new GlideRecord('incident');
        gr.addQuery('number', number);
        gr.setLimit(1);
        gr.query();

        if (!gr.next()) {
            response.setStatus(404);
            response.setBody({
                status: 'error',
                message: 'Incident not found: ' + number
            });
            return;
        }

        response.setStatus(200);
        response.setBody({
            status: 'success',
            sys_id: gr.getUniqueValue(),
            number: gr.number.toString(),
            short_description: gr.short_description.toString(),
            description: gr.description.toString(),
            state: gr.state.getDisplayValue(),
            priority: gr.priority.getDisplayValue(),
            urgency: gr.urgency.getDisplayValue(),
            impact: gr.impact.getDisplayValue(),
            category: gr.category.getDisplayValue(),
            caller: gr.caller_id.getDisplayValue(),
            assigned_to: gr.assigned_to.getDisplayValue(),
            assignment_group: gr.assignment_group.getDisplayValue(),
            created_on: gr.sys_created_on.toString(),
            updated_on: gr.sys_updated_on.toString(),
            resolved_at: gr.resolved_at.toString()
        });

    } catch (e) {
        gs.logError('Get Incident API error: ' + e.message,
            'IncidentMgmtAPI');
        response.setStatus(500);
        response.setBody({
            status: 'error',
            message: 'Internal server error: ' + e.message
        });
    }
})(request, response);
