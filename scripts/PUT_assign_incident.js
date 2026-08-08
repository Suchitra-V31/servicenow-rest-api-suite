(function process(/*RESTAPIRequest*/ request, 
                  /*RESTAPIResponse*/ response) {
  try {
    var number = request.pathParams.number;
    var body   = request.body.data;

    // ── Validate ──────────────────────────────────────────
    if (!body || !body.assignment_group) {
      response.setStatus(400);
      response.setBody({
        status:  'error',
        message: 'Missing required field: assignment_group'
      });
      return;
    }

    // ── Find incident ─────────────────────────────────────
    var gr = new GlideRecord('incident');
    gr.addQuery('number', number);
    gr.setLimit(1);
    gr.query();

    if (!gr.next()) {
      response.setStatus(404);
      response.setBody({
        status:  'error',
        message: 'Incident not found: ' + number
      });
      return;
    }

    // ── Check if already closed ───────────────────────────
    if (gr.state == 7) {
      response.setStatus(409);
      response.setBody({
        status:  'error',
        message: 'Cannot assign a closed incident'
      });
      return;
    }

    // ── Assign ────────────────────────────────────────────
    gr.assignment_group.setDisplayValue(body.assignment_group);

    if (body.assigned_to) {
      gr.assigned_to.setDisplayValue(body.assigned_to);
    }

    if (body.work_notes) {
      gr.work_notes = body.work_notes;
    } else {
      gr.work_notes = 'Assigned via REST API by ' + 
                      gs.getUserDisplayName() + 
                      ' on ' + gs.now();
    }

    gr.state = 2; // In Progress
    gr.update();

    response.setStatus(200);
    response.setBody({
      status:           'success',
      message:          'Incident assigned successfully',
      number:           gr.number.toString(),
      assignment_group: gr.assignment_group.getDisplayValue(),
      assigned_to:      gr.assigned_to.getDisplayValue(),
      state:            gr.state.getDisplayValue()
    });

  } catch (e) {
    gs.logError('Assign Incident API error: ' + e.message, 
                'IncidentMgmtAPI');
    response.setStatus(500);
    response.setBody({
      status:  'error',
      message: 'Internal server error: ' + e.message
    });
  }
})(request, response);
