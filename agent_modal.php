<div class="modal fade" id="modal-xl">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title"><div id="agentInsights"></div></h4>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="row">
          <div class="col-12 col-sm-8 col-md-3">
            <div class="info-box" style="background-color: #F2F2F4 !important;">
              <span class="info-box-icon"><p id="total-Tokens"></p></span>
              <div class="info-box-content">
                <span class="info-box-text">Total Number Of<br> Links Generated</span>
              </div>
            </div>
          </div>
          <div class="col-12 col-sm-8 col-md-3">
            <div class="info-box mb-3" style="background-color: #F2F2F4 !important;">
              <span class="info-box-icon"><p id="total-Verified-Tokens"></p></span>
              <div class="info-box-content">
                <span class="info-box-text">Agent Rank For<br> Links Generated</span>
              </div>
            </div>
          </div>
          <div class="clearfix hidden-md-up"></div>

          <div class="col-12 col-sm-8 col-md-3">
            <div class="info-box mb-3" style="background-color: #F2F2F4 !important;">
              <span class="info-box-icon"><p id="total-Active-Tokens"></p></span>
              <div class="info-box-content">
                <span class="info-box-text">Total Number Of<br> Forms Submitted</span>
              </div>
            </div>
          </div>
          <div class="col-12 col-sm-8 col-md-3">
            <div class="info-box mb-3" style="background-color: #F2F2F4 !important;">
              <span class="info-box-icon"><p id="total-Unverified-Tokens"></p></span>
              <div class="info-box-content">
                <span class="info-box-text">Total Number Of<br> Forms Submitted</span>
              </div>
            </div>
          </div>
          </div>
          <div class="row">
          <div class="col-12 col-lg-12">
           <div id="urlTable"></div>
          </div>
          <div class="row">
            <div class="col-lg-6">
              <div class="card">
                <div class="position-relative mb-4">
                  <canvas id="chart" style="height: 300px;"></canvas>
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="card">
                <div class="position-relative mb-4">
                  <canvas id="verified-chart" style="height: 300px;"></canvas>
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="card">
                <div class="position-relative mb-4">
                  <canvas id="pie-chart" style="height: 300px;"></canvas>
                </div>
              </div>
            </div>
        </div>
          </div>
            <div class="modal-footer justify-content-between">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>
          <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
</div>