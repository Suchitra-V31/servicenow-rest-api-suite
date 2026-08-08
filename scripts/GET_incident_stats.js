(function process(/*RESTAPIRequest*/ request, 
                  /*RESTAPIResponse*/ response) {
  try {
    // ── Total active count ────────────────────────────────
    var gaTotal = new GlideAggregate('incident');
    gaTotal.addQuery('active', true);
    gaTotal.addAggregate('COUNT');
    gaTotal.query();
    var totalCount = 0;
    if (gaTotal.next()) {
      totalCount = parseInt(gaTotal.getAggregate('COUNT'));
    }

    // ── Count by priority ─────────────────────────────────
    var byPriority = [];
    var gaPriority = new GlideAggregate('incident');
    gaPriority.addQuery('active', true);
    gaPriority.addAggregate('COUNT', 'priority');
    gaPriority.groupBy('priority');
    gaPriority.orderBy('priority');
    gaPriority.query();
    while (gaPriority.next()) {
      byPriority.push({
        priority: gaPriority.getDisplayValue('priority'),
        count:    parseInt(gaPriority.getAggregate('COUNT', 
                           'priority'))
      });
    }

    // ── Count by state ────────────────────────────────────
    var byState = [];
    var gaState = new GlideAggregate('incident');
    gaState.addQuery('active', true);
    gaState.addAggregate('COUNT', 'state');
    gaState.groupBy('state');
    gaState.query();
    while (gaState.next()) {
      byState.push({
        state: gaState.getDisplayValue('state'),
        count: parseInt(gaState.getAggregate('COUNT', 'state'))
      });
    }

    // ── Count by assignment group (top 5) ─────────────────
    var byGroup = [];
    var gaGroup = new GlideAggregate('incident');
    gaGroup.addQuery('active', true);
    gaGroup.addNotNullQuery('assignment_group');
    gaGroup.addAggregate('COUNT');
    gaGroup.groupBy('assignment_group');
    gaGroup.orderByDescAggregate('COUNT');
    gaGroup.setLimit(5);
    gaGroup.query();
    while (gaGroup.next()) {
      byGroup.push({
        group: gaGroup.getDisplayValue('assignment_group'),
        count: parseInt(gaGroup.getAggregate('COUNT'))
      });
    }

    response.setStatus(200);
    response.setBody({
      status:              'success',
      generated_at:        gs.now(),
      total_active:        totalCount,
      by_priority:         byPriority,
      by_state:            byState,
      top_5_groups:        byGroup
    });

  } catch (e) {
    gs.logError('Incident Stats API error: ' + e.message, 
                'IncidentMgmtAPI');
    response.setStatus(500);
    response.setBody({
      status:  'error',
      message: 'Internal server error: ' + e.message
    });
  }
})(request, response);
