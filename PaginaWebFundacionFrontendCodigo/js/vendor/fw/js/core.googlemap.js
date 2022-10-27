function fundacion_manuei_googlemap_init(dom_obj, coords) {
  "use strict";
  if (typeof fundacion_manuei_STORAGE["googlemap_init_obj"] == "undefined")
    fundacion_manuei_googlemap_init_styles();
  fundacion_manuei_STORAGE["googlemap_init_obj"].geocoder = "";
  try {
    var id = dom_obj.id;
    fundacion_manuei_STORAGE["googlemap_init_obj"][id] = {
      dom: dom_obj,
      markers: coords.markers,
      geocoder_request: false,
      opt: {
        zoom: coords.zoom,
        center: null,
        scrollwheel: false,
        scaleControl: false,
        disableDefaultUI: false,
        panControl: true,
        zoomControl: true, //zoom
        mapTypeControl: false,
        streetViewControl: false,
        overviewMapControl: false,
        styles:
          fundacion_manuei_STORAGE["googlemap_styles"][
            coords.style ? coords.style : "default"
          ],
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      },
    };

    fundacion_manuei_googlemap_create(id);
  } catch (e) {
    dcl(fundacion_manuei_STORAGE["strings"]["googlemap_not_avail"]);
  }
}

function fundacion_manuei_googlemap_create(id) {
  "use strict";

  // Create map
  fundacion_manuei_STORAGE["googlemap_init_obj"][id].map = new google.maps.Map(
    fundacion_manuei_STORAGE["googlemap_init_obj"][id].dom,
    fundacion_manuei_STORAGE["googlemap_init_obj"][id].opt
  );

  // Add markers
  for (var i in fundacion_manuei_STORAGE["googlemap_init_obj"][id].markers)
    fundacion_manuei_STORAGE["googlemap_init_obj"][id].markers[
      i
    ].inited = false;
  fundacion_manuei_googlemap_add_markers(id);

  // Add resize listener
  jQuery(window).resize(function () {
    if (fundacion_manuei_STORAGE["googlemap_init_obj"][id].map)
      fundacion_manuei_STORAGE["googlemap_init_obj"][id].map.setCenter(
        fundacion_manuei_STORAGE["googlemap_init_obj"][id].opt.center
      );
  });
}

function fundacion_manuei_googlemap_add_markers(id) {
  "use strict";
  for (var i in fundacion_manuei_STORAGE["googlemap_init_obj"][id].markers) {
    if (fundacion_manuei_STORAGE["googlemap_init_obj"][id].markers[i].inited)
      continue;

    if (
      fundacion_manuei_STORAGE["googlemap_init_obj"][id].markers[i].latlng == ""
    ) {
      if (
        fundacion_manuei_STORAGE["googlemap_init_obj"][id].geocoder_request !==
        false
      )
        continue;

      if (fundacion_manuei_STORAGE["googlemap_init_obj"].geocoder == "")
        fundacion_manuei_STORAGE["googlemap_init_obj"].geocoder =
          new google.maps.Geocoder();
      fundacion_manuei_STORAGE["googlemap_init_obj"][id].geocoder_request = i;
      fundacion_manuei_STORAGE["googlemap_init_obj"].geocoder.geocode(
        {
          address:
            fundacion_manuei_STORAGE["googlemap_init_obj"][id].markers[i]
              .address,
        },
        function (results, status) {
          "use strict";
          if (status == google.maps.GeocoderStatus.OK) {
            var idx =
              fundacion_manuei_STORAGE["googlemap_init_obj"][id]
                .geocoder_request;
            if (
              results[0].geometry.location.lat &&
              results[0].geometry.location.lng
            ) {
              fundacion_manuei_STORAGE["googlemap_init_obj"][id].markers[
                idx
              ].latlng =
                "" +
                results[0].geometry.location.lat() +
                "," +
                results[0].geometry.location.lng();
            } else {
              fundacion_manuei_STORAGE["googlemap_init_obj"][id].markers[
                idx
              ].latlng = results[0].geometry.location
                .toString()
                .replace(/\(\)/g, "");
            }
            fundacion_manuei_STORAGE["googlemap_init_obj"][
              id
            ].geocoder_request = false;
            setTimeout(function () {
              fundacion_manuei_googlemap_add_markers(id);
            }, 200);
          } else
            dcl(
              fundacion_manuei_STORAGE["strings"]["geocode_error"] +
                " " +
                status
            );
        }
      );
    } else {
      // Prepare marker object
      var latlngStr =
        fundacion_manuei_STORAGE["googlemap_init_obj"][id].markers[
          i
        ].latlng.split(",");
      var markerInit = {
        map: fundacion_manuei_STORAGE["googlemap_init_obj"][id].map,
        position: new google.maps.LatLng(latlngStr[0], latlngStr[1]),
        clickable:
          fundacion_manuei_STORAGE["googlemap_init_obj"][id].markers[i]
            .description != "",
      };
      if (fundacion_manuei_STORAGE["googlemap_init_obj"][id].markers[i].point)
        markerInit.icon =
          fundacion_manuei_STORAGE["googlemap_init_obj"][id].markers[i].point;
      if (fundacion_manuei_STORAGE["googlemap_init_obj"][id].markers[i].title)
        markerInit.title =
          fundacion_manuei_STORAGE["googlemap_init_obj"][id].markers[i].title;
      fundacion_manuei_STORAGE["googlemap_init_obj"][id].markers[i].marker =
        new google.maps.Marker(markerInit);

      // Set Map center
      if (
        fundacion_manuei_STORAGE["googlemap_init_obj"][id].opt.center == null
      ) {
        fundacion_manuei_STORAGE["googlemap_init_obj"][id].opt.center =
          markerInit.position;
        fundacion_manuei_STORAGE["googlemap_init_obj"][id].map.setCenter(
          fundacion_manuei_STORAGE["googlemap_init_obj"][id].opt.center
        );
      }

      // Add description window
      if (
        fundacion_manuei_STORAGE["googlemap_init_obj"][id].markers[i]
          .description != ""
      ) {
        fundacion_manuei_STORAGE["googlemap_init_obj"][id].markers[
          i
        ].infowindow = new google.maps.InfoWindow({
          content:
            fundacion_manuei_STORAGE["googlemap_init_obj"][id].markers[i]
              .description,
        });
        google.maps.event.addListener(
          fundacion_manuei_STORAGE["googlemap_init_obj"][id].markers[i].marker,
          "click",
          function (e) {
            var latlng = e.latLng
              .toString()
              .replace("(", "")
              .replace(")", "")
              .replace(" ", "");
            for (var i in fundacion_manuei_STORAGE["googlemap_init_obj"][id]
              .markers) {
              if (
                latlng ==
                fundacion_manuei_STORAGE["googlemap_init_obj"][id].markers[i]
                  .latlng
              ) {
                fundacion_manuei_STORAGE["googlemap_init_obj"][id].markers[
                  i
                ].infowindow.open(
                  fundacion_manuei_STORAGE["googlemap_init_obj"][id].map,
                  fundacion_manuei_STORAGE["googlemap_init_obj"][id].markers[i]
                    .marker
                );
                break;
              }
            }
          }
        );
      }

      fundacion_manuei_STORAGE["googlemap_init_obj"][id].markers[
        i
      ].inited = true;
    }
  }
}

function fundacion_manuei_googlemap_refresh() {
  "use strict";
  for (id in fundacion_manuei_STORAGE["googlemap_init_obj"]) {
    fundacion_manuei_googlemap_create(id);
  }
}

function fundacion_manuei_googlemap_init_styles() {
  // Init Google map
  fundacion_manuei_STORAGE["googlemap_init_obj"] = {};
  fundacion_manuei_STORAGE["googlemap_styles"] = {
    default: [],
  };
  if (window.fundacion_manuei_theme_googlemap_styles !== undefined)
    fundacion_manuei_STORAGE["googlemap_styles"] =
      fundacion_manuei_theme_googlemap_styles(
        fundacion_manuei_STORAGE["googlemap_styles"]
      );
}
