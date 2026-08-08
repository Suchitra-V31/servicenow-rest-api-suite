(function process(/*RESTAPIRequest*/ request, 
                  /*RESTAPIResponse*/ response) {
  try {
    var body = request.body.data;

    // ── Validate required fields ──────────────────────────
    if (!body) {
      response.setStatus(400);
      response.setBody({
        status: 'error',
        message: 'Request body is empty'
      });
      return;
    }

    if (!body.short_description) {
      response.setStatus(400);
      response.setBody({
        status: 'error',
        message: 'Missing required field: short_description'
      });
      return;
    }

    if (!body.caller) {
      response.setStatus(400);
      response.setBody({
        status: 'error',
        message: 'Missing required field: caller'
      });
      return;
    }

    // ── Create the incident ───────────────────────────────
    var gr = new GlideRecord('incident');
    gr.initialize();
    gr.short_description = body.short_description;
    gr.description       = body.description   || '';
    gr.urgency           = body.urgency        || 3;
    gr.impact            = body.impact         || 3;
    gr.category          = body.category       || 'inquiry';

    gr.caller_id.setDisplayValue(body.caller);

    if (body.assignment_group) {
      gr.assignment_group.setDisplayValue(body.assignment_group);
    }

    var sysId = gr.insert();

    if (!sysId) {
      response.setStatus(500);
      response.setBody({
        status: 'error',
        message: 'Failed to create incident'
      });
      return;
    }

    // ── Re-query to get generated number ──────────────────
    var created = new GlideRecord('incident');
    created.get(sysId);

    response.setStatus(201);
    response.setBody({
      status:            'success',
      message:           'Incident created successfully',
      sys_id:            sysId,
      number:            created.number.toString(),
      short_description: created.short_description.toString(),
      state:             created.state.getDisplayValue(),
      priority:          created.priority.getDisplayValue(),
      created_on:        created.sys_created_on.toString()
    });

  } catch (e) {
    gs.logError('Create Incident API error: ' + e.message, 
                'IncidentMgmtAPI');
    response.setStatus(500);
    response.setBody({
      status:  'error',
      message: 'Internal server error: ' + e.message
    });
  }
})(request, response);
